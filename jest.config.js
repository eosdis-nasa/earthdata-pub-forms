module.exports = {
  testEnvironment: "jsdom",
  rootDir: './',
  roots: [
    '<rootDir>/test'
  ],
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1"
    },
    moduleFileExtensions: ['js', 'vue'],
    transform: {
        ".*\\.(js)$": "babel-jest",
    
        // process `*.vue` files with `vue-jest`
        ".*\\.(vue)$": "vue-jest"
    },
    collectCoverage: true,
    coverageThreshold:{
        global:{
        branches: 5,
        functions: 4,
        lines: 40,
        },
    snapshotSerializers: ["jest-serializer-vue"]
  }
}