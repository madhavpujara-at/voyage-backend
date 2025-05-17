module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended' // This should be last to override other configs
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json', // Important for some TS-specific rules
  },
  env: {
    node: true,
    es6: true,
    jest: true, // For Jest global variables
  },
  rules: {
    'prettier/prettier': 'warn', // Show Prettier issues as warnings
    '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // You can add more specific rules here
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '.eslintrc.js', // Don't lint itself
    'jest.config.js' // Don't lint jest config by default
  ]
}; 