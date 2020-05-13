module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'standard',
    'prettier',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['prettier', '@typescript-eslint'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': ['error'],
  },
}
