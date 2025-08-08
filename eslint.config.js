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
  packageJson.configs.recommended,
  {
    files: ['**/*.{js,ts}'],
    plugins: {
      prettier,
      jsdoc
    },
    extends: [
      eslint.configs.recommended,
      jsdoc.configs['flat/recommended'],
      tseslint.configs.strict,
      tseslint.configs.stylistic,
      eslintPluginPrettierRecommended
    ],
    rules: {
      // https://github.com/gajus/eslint-plugin-jsdoc/issues/99
      'jsdoc/no-undefined-types': ['off'],
      'jsdoc/require-jsdoc': [
        'warn',
        {
          require: {
            ArrowFunctionExpression: true,
            ClassDeclaration: true,
            ClassExpression: true,
            FunctionDeclaration: true,
            FunctionExpression: true
            // MethodDefinition: true
          }
        }
      ],
      'jsdoc/require-description': [
        'warn',
        {
          contexts: [
            'ArrowFunctionExpression',
            'ClassDeclaration',
            'ClassExpression',
            'FunctionDeclaration',
            'FunctionExpression:not(MethodDefinition > FunctionExpression)',
            'MethodDefinition:not([kind="get"], [kind="set"], [kind="constructor"])'
          ]
        }
      ],
      'jsdoc/no-blank-blocks': 'warn',
      quotes: ['warn', 'single', { avoidEscape: true }]
    },
    settings: {
      jsdoc: {
        preferredTypes: {
          any: false,
          '*': false
        }
      }
    }
  },
  {
    files: ['**/*.json'],
    ignores: ['package-lock.json'],
    plugins: { json },
    language: 'json/json',
    extends: ['json/recommended']
  },
  {
    files: ['**/tsconfig.json', '.vscode/*.json'],
    plugins: { json },
    language: 'json/jsonc',
    languageOptions: {
      allowTrailingCommas: true
    },
    extends: ['json/recommended']
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
  },
  // root-level files are Node scripts
  {
    files: ['*.js', '*.ts'],
    languageOptions: {
      globals: globals.node
    }
  },
  // static files are browser scripts
  {
    files: ['static/**/*.{js, ts}'],
    languageOptions: {
      globals: globals.browser
    }
  }
]);
