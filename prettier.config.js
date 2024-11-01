/** @type {import("prettier").Config} */
module.exports = {
  trailingComma: 'all',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  printWidth: 120,
  endOfLine: 'lf',
  arrowParens: 'always',
  bracketSpacing: true,
  singleAttributePerLine: true,
  bracketSameLine: false,
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-css-order', 'prettier-plugin-tailwindcss'],
  importOrder: [
    '<BUILTIN_MODULES>', // Node.js built-in modules
    '<THIRD_PARTY_MODULES>', // Imports not matched by other special words or groups.
    '', // Empty line
    '^@repo/', // Imports from the monorepo
    '', // Empty line
    '^~(.*)$', // Imports from the project root
    '', // Empty line
    '^[./]', // Imports from anywhere else
  ],
};
