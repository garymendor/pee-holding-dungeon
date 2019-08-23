module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["**/src/**/*.js", "!**/src/**/*.spec.js"],
  coverageDirectory: "./build/coverage",
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  },
  projects: [
    {
      displayName: "tests",
      testEnvironment: "jsdom",
      testMatch: ["**/src/**/?(*.)spec.js"],
      setupFiles: ["<rootDir>/test/jest-setup.js"],
      clearMocks: true
    }
  ],
  reporters: [
    "default",
    [
      "./node_modules/jest-html-reporter",
      {
        pageTitle: "TestReport",
        outputPath: "./build/test-report.html"
      }
    ]
  ]
};
