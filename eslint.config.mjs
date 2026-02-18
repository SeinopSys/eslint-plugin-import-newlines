import { defineConfig } from 'eslint/config';
import eslintPlugin from 'eslint-plugin-eslint-plugin';
import globals from 'globals';
import js from '@eslint/js';

export default defineConfig([
  js.configs.recommended,
  {
    plugins: {
      'eslint-plugin': eslintPlugin,
    },

    languageOptions: {
      globals: {
        ...globals.commonjs,
        ...globals.node,
      },

      ecmaVersion: 11,
      sourceType: 'module',
    },

    rules: {
      quotes: ['error', 'single'],

      'no-nested-ternary': 'off',
    },
  },
]);
