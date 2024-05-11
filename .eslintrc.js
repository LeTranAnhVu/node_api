module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
      'plugin:prettier/recommended',
      'prettier',
      'eslint:recommended'
    ],
    plugins: ['@typescript-eslint'],
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      project: 'tsconfig.json',
    },
    env: {
      es6: true,
      node: true,
    },
    rules: {
      'no-var': 'error',
      semi: ['error', 'never'],
      indent: ['error', 4, { SwitchCase: 1, "ignoredNodes": ["PropertyDefinition"] }],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      'no-multi-spaces': 'error',
      'space-in-parens': 'error',
      'no-multiple-empty-lines': 'error',
      'prefer-const': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error'
    },
  };