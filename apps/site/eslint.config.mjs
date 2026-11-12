import js from '@eslint/js';
import tseslint from 'typescript-eslint';

const sourceLanguage = {
  ecmaVersion: 2022,
  sourceType: 'module',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  globals: {
    React: 'readonly',
    JSX: 'readonly',
    console: 'readonly',
    process: 'readonly',
    __dirname: 'readonly',
    module: 'readonly',
    require: 'readonly',
  },
};

export default [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'out/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  {
    ...js.configs.recommended,
    files: ['**/*.{js,jsx,mjs,cjs}'],
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: sourceLanguage,
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
  })),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: sourceLanguage,
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
];
