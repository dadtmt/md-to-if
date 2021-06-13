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
    'plugin:@typescript-eslint/eslint-recommended',
    'standard-with-typescript',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.eslint.json',
  },
  rules: {
    'prettier/prettier': ['error'],
    '@typescript-eslint/member-delimiter-style': ["error", {
      multiline: {
        delimiter: 'none',
        requireLast: false,
      },
      singleline: {
        delimiter: 'comma',
        requireLast: false,
      },
    }],
  },
}
