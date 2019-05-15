module.exports = {
  // Global variables available in all test environments.
  globals: {
    __DEV__: true
  },
  // Modules that configure or set up the testing framework before each test.
  setupFilesAfterEnv: ["<rootDir>/test/jest/jest.setup.js"],
  noStackTrace: true, // Disable stack trace in test output.
  bail: true, // Stop running tests after a failure.
  cache: false, // Disables caching - TODO is there a reason for this?
  verbose: true, // Display individual test results.
  collectCoverage: true, // Collect coverage information?
  coverageDirectory: "<rootDir>/test/jest/coverage", // Where to store coverage files
  collectCoverageFrom: [
    "<rootDir>/src/**/*.vue",
    "<rootDir>/src/**/*.js",
    "<rootDir>/src/**/*.ts"
  ],
  coverageThreshold: {
    global: {
      //  branches: 50,
      //  functions: 50,
      //  lines: 50,
      //  statements: 50
    }
  },
  // Glob patterns used to detect test files
  testMatch: [
    "<rootDir>/test/jest/__tests__/**/*.spec.[jt]s",
    "<rootDir>/test/jest/__tests__/**/*.test.[jt]s",
    "<rootDir>/src/**/__tests__/*_jest.spec.[jt]s"
  ],
  // File extensions for modules. When requiring modules without a file extension,
  // Jest looks for these (left-to-right order).
  moduleFileExtensions: ["ts", "js", "json", "vue"],
  // Stub out resources (e.g., images or styles) with a single module.
  // Allows regex backreference substitution.
  // Usually should use `^...$` boundaries.
  moduleNameMapper: {
    "^vue$": "<rootDir>/node_modules/vue/dist/vue.common.js",
    "^test-utils$":
      "<rootDir>/node_modules/@vue/test-utils/dist/vue-test-utils.js",
    "^quasar$": "<rootDir>/node_modules/quasar/dist/quasar.common.js",
    "^~/(.*)$": "<rootDir>/$1",
    "^src/(.*)$": "<rootDir>/src/$1",
    ".*css$": "<rootDir>/test/jest/utils/stub.css"
  },
  // Map path regexp to transformer (module that provides
  // a synchronous function for transforming source files).
  transform: {
    "^.+\\.ts$": "ts-jest",
    "^.+\\.js$": "babel-jest",
    "^.+\\.vue$": "vue-jest"
  },
  snapshotSerializers: ["<rootDir>/node_modules/jest-serializer-vue"]
};
