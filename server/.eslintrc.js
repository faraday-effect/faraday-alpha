// See https://dev.to/robertcoopercode/using-eslint-and-prettier-in-a-typescript-project-53jb

module.exports = {
  // Use Typescript parser.
  parser: "@typescript-eslint/parser",

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },

  env: {
    node: true,
    jest: true
  },

  extends: [
    // Use TypeScript plugin.
    "plugin:@typescript-eslint/recommended",

    // Disable ESLint rules that conflict with Prettier.
    "prettier/@typescript-eslint",

    // Display prettier errors as ESLint errors.
    // Must be last configuration in the `extends` array.
    "plugin:prettier/recommended"
  ],

  rules: {
    // Typescript infers these.
    "@typescript-eslint/explicit-function-return-type": "off",

    // Allow properties to be declared in constructor.
    "@typescript-eslint/no-parameter-properties": "off",

    // Runs afoul of fat arrow functions in decorators.
    "@typescript-eslint/no-unused-vars": "off",

    // Rely on default accessibility rules.
    "@typescript-eslint/explicit-member-accessibility": "off",
  }
};
