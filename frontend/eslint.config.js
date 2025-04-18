import parser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import angularPlugin from '@angular-eslint/eslint-plugin';
import templatePlugin from '@angular-eslint/eslint-plugin-template';

export default [
  {
    ignores: [
      'coverage',
      'dist',
      'node_modules',
      '**/*.html',
      '**/*.htm',
      '**/*.html.html',
      '**/*.ts.html',
    ],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      '@angular-eslint': angularPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@angular-eslint/directive-selector': 'off',
      '@angular-eslint/component-selector': 'off',
    },
  },
  {
    files: ['**/*.html'],
    plugins: {
      '@angular-eslint/template': templatePlugin,
    },
    rules: {},
  },
];
