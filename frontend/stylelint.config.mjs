/** @type {import('stylelint').Config} */
const config = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order',
    '@dreamsicle.io/stylelint-config-tailwindcss',
  ],
  plugins: ['stylelint-order'],
  rules: {
    'declaration-block-no-duplicate-properties': true,
    'block-no-empty': true,
    'font-family-name-quotes': 'always-where-recommended',
    'import-notation': 'string',
  },
};

export default config;
