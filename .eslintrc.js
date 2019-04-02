module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react/recommended', 'plugin:prettier/recommended', 'prettier/@typescript-eslint', 'prettier/babel', 'prettier/react'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'babel', 'prettier', 'react', 'react-hooks'],
  root: true,
  rules: {
    'prettier/prettier': 'error'
  },
  settings: {
    react: {
      version: '16.8.6',
    },
  },
}
