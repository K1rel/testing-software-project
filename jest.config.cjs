
// module.exports = {
//   testEnvironment: 'node',
//   roots: ['<rootDir>/src', '<rootDir>/tests'],
//   testMatch: ['**/*.test.js'],
//   setupFilesAfterEnv: ["<rootDir>/tests/unit/setup.js"],
//   globalTeardown: '<rootDir>/tests/unit/teardown.js',
//   moduleFileExtensions: ['js', 'json'],
//   transform: {
//     '^.+\\.js$': 'babel-jest'
//   },
//   transformIgnorePatterns: [
//     '/node_modules/(?!(your-esm-modules)/)'
//   ],
//   moduleNameMapper: {
//     '^@models/(.*)$': '<rootDir>/src/models/$1',
//     '^@services/(.*)$': '<rootDir>/src/services/$1'
//   }
// };

module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
  // Only use setup/teardown files for unit tests
  setupFilesAfterEnv: process.env.TEST_SUITE === 'unit' ? ["<rootDir>/tests/unit/setup.js"] : [],
  globalTeardown: process.env.TEST_SUITE === 'unit' ? '<rootDir>/tests/unit/teardown.js' : undefined,
  moduleFileExtensions: ['js', 'json'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(your-esm-modules)/)'
  ],
  moduleNameMapper: {
    '^@models/(.*)$': '<rootDir>/src/models/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1'
  }
};