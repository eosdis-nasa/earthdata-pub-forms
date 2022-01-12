module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  "collectCoverage": true,
  "collectCoverageFrom": ["src/**/*.{js,jsx,ts,tsx}", "!**/node_modules/**"],
  "coverageReporters": ["html", "text-summary"],
  "moduleFileExtensions": [
    "js",
    "json",
    "vue"
  ],
  transformIgnorePatterns: ['/node_modules/'],
  "transform": {
    ".*\\.(vue)$": "vue-jest",
    "^.+\\.js$": "babel-jest",
  },
  "snapshotSerializers": ["jest-serializer-vue"],
  "setupFiles": ["jest-localstorage-mock","<rootDir>/__mocks__/client.js"],
  "moduleNameMapper": {
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js",
    "\\.(gif|ttf|eot|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
  "resolver":null,
  "verbose":true,
  "testEnvironment": "jest-environment-jsdom-global"
}
