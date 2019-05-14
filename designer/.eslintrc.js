module.exports = {
  // Don't look in parent folders.
  root: true,

  // Predefine sets of global variables
  env: {
    browser: true
  },

  extends: [
    // Official ESLint plugin for Vue.
    "plugin:vue/recommended",

    // Extend for Prettier
    "@vue/prettier",

    // Extend for TypeScript
    "@vue/typescript"
  ],

  // add your custom rules here
  rules: {
    "no-console": "off",
    "no-debugger": "off"
  }
};
