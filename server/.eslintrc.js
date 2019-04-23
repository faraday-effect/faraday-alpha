// See https://dev.to/robertcoopercode/using-eslint-and-prettier-in-a-typescript-project-53jb

module.exports = {
  // Use Typescript parser.
  parser: "@typescript-eslint/parser",

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },

  // env: {
  //   node: true,
  //   jest: true
  // },

  extends: [
    // Use @typescript-eslint/eslint-plugin rules
    "plugin:@typescript-eslint/recommended",

    // Disable ESLint rules that would conflict with prettier
    "prettier/@typescript-eslint",

    // Display prettier errors as ESLint errors.
    // Must be last configuration in the extends array.
    "plugin:prettier/recommended"
  ]
};
