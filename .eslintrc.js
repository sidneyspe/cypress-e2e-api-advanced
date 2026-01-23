module.exports = {

  root: true,

  env: {

    browser: true,

    node: true,

    es2022: true,

    'cypress/globals': true,

  },

  parser: '@typescript-eslint/parser',

  parserOptions: {

    ecmaVersion: 'latest',

    sourceType: 'module',

    project: './tsconfig.json',

  },

  plugins: ['@typescript-eslint', 'cypress', 'prettier'],

  extends: [

    'eslint:recommended',

    'plugin:@typescript-eslint/recommended',

    'plugin:cypress/recommended',

    'plugin:prettier/recommended',

  ],

  rules: {

    // Cypress especifico

    'cypress/no-assigning-return-values': 'error',

    'cypress/no-unnecessary-waiting': 'error',

    'cypress/assertion-before-screenshot': 'warn',

    'cypress/no-force': 'warn',

    'cypress/no-async-tests': 'error',

    'cypress/no-pause': 'error',


    // TypeScript

    '@typescript-eslint/explicit-function-return-type': 'off',

    '@typescript-eslint/no-explicit-any': 'warn',

    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],


    // Geral

    'no-console': ['warn', { allow: ['warn', 'error'] }],

    'prefer-const': 'error',

    'no-var': 'error',


    // Prettier

    'prettier/prettier': 'error',

  },

  ignorePatterns: [
    'node_modules/',
    'cypress/artifacts/',
    'reports/',
    'db/',
    'dist/',
  ],

};

