import * as fs from 'fs/promises';

const regionRegex = /<!--{{(?<open>.+)}}-->(?<content>(.|\n)*?)<!--{{(?<close>\/.+)}}-->/i;

// todo: document and test
async function transform(path, layout) {
  const stat = await fs.stat(path);

  if (stat.isFile() && path.endsWith('.html.inc')) {
    let text = await fs.readFile(path, 'utf8');

    let result = layout;

    const fragmentRegions = new Map();
    for (let region = regionRegex.exec(text); region !== null; region = regionRegex.exec(text)) {
      text = text.substring(0, region.index) + text.substring(region.index + region[0].length);
      if (!(`/${region.groups?.open}` === region.groups?.close)) {
        throw new Error(
          "fragment's region tags don't match!",
          region.groups?.open,
          region.groups?.close
        );
      }
      const label = region.groups?.open;
      fragmentRegions.set(label, region[0]);

      const layoutMatch = result.match(
        new RegExp(`<!--{{${label}}}-->(.|\n)*<!--{{/${label}}}-->`, 'i')
      );
      if (layoutMatch === null) {
        throw new Error('could not find matching region in layout for', label);
      }
      result =
        result.substring(0, layoutMatch.index) +
        region[0] +
        result.substring(layoutMatch.index + layoutMatch[0].length);
    }

    await fs.writeFile(path.replace('.html.inc', '.html'), result, 'utf8');
    await fs.rm(path);
  } else if (stat.isDirectory()) {
    await Promise.all(
      (await fs.readdir(path))
        .map((subpath) => `${path}/${subpath}`)
        .map((somepath) => transform(somepath, layout))
    );
  }
}

(async () => {
  // remove existing build folder
  await fs.stat('build').then(() => fs.rm('build', { recursive: true }));
  // re-create build folder
  await fs.mkdir('build', { recursive: true });
  /* pre-render fragments */
  // copy all fragments to where pre-rendered HTML files will be.
  await fs.cp('fragments', 'build', { recursive: true });
  const layout = await fs.readFile('layout.html', 'utf8');
  // convert fragments to HTML by pre-rendering them.
  transform('build', layout);
  /* copy assets */
  await fs.cp('fragments', 'build/fragments', { recursive: true });
  await fs.cp('static', 'build/static', { recursive: true });
  console.log('rendered!');
})();
