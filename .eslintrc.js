module.exports = {
  plugins: ['unused-imports'],
  rules: {
    'arrow-body-style': ['error', 'as-needed'],
    'unused-imports/no-unused-imports': 'error',
    'no-undef': 'off',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/explicit-member-accessibility': 'off',
  },
  extends: ['alloy', 'alloy/typescript'],
  overrides: [
    {
      files: ['**/*.spec.ts'],
      rules: {
        'max-nested-callbacks': 'off',
        'max-params': 'off',
      },
    },
  ],
}
