/**
 * @file Robust ESLint configuration.
 * @author Jordan Mann
 */

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import packageJson from 'eslint-plugin-package-json';
import jsdoc from 'eslint-plugin-jsdoc';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import { includeIgnoreFile } from '@eslint/compat';
import { fileURLToPath } from 'node:url';
import globals from 'globals';
import html from '@html-eslint/eslint-plugin';
import { defineConfig } from 'eslint/config';

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));

export default defineConfig([
  includeIgnoreFile(gitignorePath, 'Imported .gitignore patterns'),
  {
    files: ['**/*.{html,html.inc}'],
    plugins: {
      html
    },
    language: 'html/html'
  },
  {
    files: ['**/*.js'],
    plugins: {
      prettier
    },
    languageOptions: {
      globals: globals.browser
    }
  },
  packageJson.configs.recommended,
  {
    files: ['**/*.js'],
    plugins: {
      jsdoc
    },
    rules: {
      ...jsdoc.configs['flat/recommended'].rules,
      ...tseslint.configs.strict.rules,
      ...tseslint.configs.stylistic.rules,
      ...eslintPluginPrettierRecommended.rules,
      ...eslint.configs.recommended.rules
    }
  },
  {
    plugins: {
      json
    },
    files: ['**/*.json'],
    language: 'json/json',
    rules: {
      'json/no-duplicate-keys': 'error'
    }
  },
  {
    files: ['**/*.md'],
    plugins: {
      markdown
    },
    language: 'markdown/commonmark',
    rules: {
      'markdown/no-html': 'error'
    }
  }
]);
