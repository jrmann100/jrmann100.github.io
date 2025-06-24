/**
 * @file Pre-renders .html.inc include files into full HTML pages.
 * @author Jordan Mann
 * @license MIT
 * This script should require no NPM dependencies to run.
 */

import * as fs from 'fs/promises';
import { execSync } from 'child_process';

/**
 * Get the build version ID (use the current commit hash)
 * @returns {string} the build version ID.
 */
function getBuildVersion() {
  if (process.env.mode === 'dev') {
    return 'dev';
  }
  return execSync('git rev-parse @').toString().trim();
}

/**
 * Matches a region of format <!--{{name}}-->[content]<!--{{/name}}-->
 */
const regionRegex = /<!--{{(?<open>.+)}}-->(?<content>(.|\n)*?)<!--{{(?<close>\/.+)}}-->/i;

/**
 * Extracts regions from a fragment.
 * @param {string} text the fragment text.
 * @returns {Map<string,string>} the regions.
 */
function locateRegions(text) {
  /** @type {Map<string, string>} */
  const regions = new Map();
  for (const region of text.matchAll(new RegExp(regionRegex, 'g'))) {
    if (!(`/${region.groups?.open}` === region.groups?.close)) {
      throw new Error(
        `fragment's region tags don't match! '${region.groups?.open}' and '${region.groups?.close}'`
      );
    }
    regions.set(region.groups?.open, region[0]);
  }
  return regions;
}

/**
 * Parses a layout. Locates regions while also labeling intermediate content as '_content_N' sections.
 * @param {string} text the layout text.
 * @returns {Map<string,string>} the sections.
 */
function locateSections(text) {
  /** @type {Map<string, string>} */
  const sections = new Map();
  let contentIndex = 0;
  for (let region = regionRegex.exec(text); region !== null; region = regionRegex.exec(text)) {
    if (region.groups?.open.startsWith('_content_')) {
      throw new Error(`region label cannot start with internally-used '_content_' header`);
    }
    if (region.index !== 0) {
      sections.set(`_content_${contentIndex++}`, text.substring(0, region.index));
    }
    sections.set(region.groups?.open, region[0]);
    text = text.substring(region.index + region[0].length);
  }
  if (text.length > 0) {
    sections.set(`_content_${contentIndex++}`, text);
  }
  return sections;
}

/**
 * Recursively pre-render all include files within a folder.
 * @param {string} path the path to the folder in which to locate include files.
 * @param {Map<string, string>} layoutSections sections (content and regions) of layout
 * @todo document and test edge cases
 */
async function transform(path, layoutSections) {
  const stat = await fs.stat(path);

  // pre-render the include file.
  if (stat.isFile() && path.endsWith('.html.inc')) {
    let text = await fs.readFile(path, 'utf8');

    let sections = new Map(layoutSections);
    for (const [label, region] of locateRegions(text)) {
      if (sections.has(label)) {
        sections.set(label, region);
      } else {
        console.warn(
          `warning: could not find matching layout region for fragment region '${label}'`
        );
      }
    }
    if (sections.has('debug')) {
      sections.set(
        'debug',
        `<!--{{debug}}-->
<meta name="build-version" content="${getBuildVersion()}">
<!--{{/debug}}-->`
      );
    }
    await fs.writeFile(path.replace('.html.inc', '.html'), [...sections.values()].join(''), 'utf8');
    await fs.rm(path);
  } else if (stat.isDirectory()) {
    await Promise.all(
      (await fs.readdir(path))
        .map((subpath) => `${path}/${subpath}`)
        .map((somepath) => transform(somepath, layoutSections))
    );
  }
}

/**
 * Recursively .html.inc fragments to .html.
 * @param {string} path the path to the folder in which to rename fragments.
 */
async function removeInc(path) {
  const stat = await fs.stat(path);

  // rename the file.
  if (stat.isFile() && path.endsWith('.html.inc')) {
    await fs.rename(path, path.replace(/\.html\.inc$/, '.html'));
  } else if (stat.isDirectory()) {
    await Promise.all(
      (await fs.readdir(path))
        .map((subpath) => `${path}/${subpath}`)
        .map((somepath) => removeInc(somepath))
    );
  }
}

/**
 * Transform fragments/ using layout.html; copy static/ and fragments/ into the build/ folder.
 */
async function main() {
  const buildType = process.env.mode === 'dev' ? 'dev build' : 'prod build';
  console.time(buildType);
  // console.time('- clean');
  // remove existing build folder
  try {
    await fs.stat('build');
    await fs.rm('build', { recursive: true });
  } catch {
    // build folder does not exist
  }
  // console.timeEnd('- clean');

  // console.time('- transform');
  /* pre-render fragments */
  // copy all fragments to where pre-rendered HTML files will be.
  await fs.cp('fragments', 'build', { recursive: true });
  const layout = await fs.readFile('layout.html', 'utf8');
  const layoutSections = locateSections(layout);
  // convert fragments to HTML by pre-rendering them.
  await transform('build', layoutSections);
  // console.timeEnd('- transform');

  // console.time('- assets');
  await fs.cp('fragments', 'build/fragments', { recursive: true });
  await removeInc('build/fragments');
  await fs.cp('static', 'build/static', { recursive: true });
  // console.timeEnd('- assets');

  console.timeEnd(buildType);
}
main();
