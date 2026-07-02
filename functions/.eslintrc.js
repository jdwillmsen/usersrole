module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'google',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json'],
    sourceType: 'module'
  },
  ignorePatterns: [
    '/lib/**/*', // Ignore built files.
    '.eslintrc.js' // Ignore the ESLint config itself.
  ],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'object-curly-spacing': ['error', 'always'],
    'import/no-unresolved': 0,
    'valid-jsdoc': 'off',
    'require-jsdoc': 'off',
    'linebreak-style': 0,
    'comma-dangle': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'indent': 'off',
    'max-len': 0
  }
};
