module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
    'prettier/babel',
    'prettier/react',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'babel', 'jest', 'prettier', 'react', 'react-hooks'],
  root: true,
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    // TODO we need to type everything but explicit is kinda ok, implicit is the real bad one
    '@typescript-eslint/no-explicit-any': 'off',
    'no-console': 'error',
    'no-case-declarations': 'off',
    'prettier/prettier': 'error',
    'react/prop-types': 'off',
  },
  settings: {
    react: {
      version: '16.8.6',
    },
  },
}
