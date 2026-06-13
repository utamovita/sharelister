// apps/backend/eslint.config.mjs
// @ts-check

import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type { import('typescript-eslint').Config } */
const baseConfig = {
  ignores: ['eslint.config.mjs', 'dist/', 'src/generated/'],
};

/** @type { import('typescript-eslint').Config } */
const jsConfig = eslint.configs.recommended;

/** @type { import('typescript-eslint').Config } */
const tsConfig = {
  files: ['src/**/*.ts'],
  extends: [...tseslint.configs.strictTypeChecked],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: './tsconfig.eslint.json',
      tsconfigRootDir: import.meta.dirname,
    },
  },
  plugins: {
    '@typescript-eslint': tseslint.plugin,
    'simple-import-sort': simpleImportSort,
  },
  rules: {
    '@typescript-eslint/no-extraneous-class': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-unsafe-argument': 'warn',
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],

    // === Reguły stylu i spójności ===
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
  },
};

/** @type { import('typescript-eslint').Config } */
const testConfig = {
  files: ['**/*.spec.ts'],
  rules: {
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
  },
};

/** @type { import('typescript-eslint').Config } */
const prettierConfig = eslintPluginPrettierRecommended;

export default tseslint.config(baseConfig, jsConfig, tsConfig, testConfig, prettierConfig, {
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.jest,
    },
  },
});