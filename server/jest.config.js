module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__test__/*.spec.ts", "**/test/*.e2e-spec.ts"],
  testPathIgnorePatterns: ["<rootDir>/build/", "<rootDir>/node_modules/"]
};
