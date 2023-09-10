module.exports = {
  clearMocks: true,
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'ts'],
  setupFiles: ['dotenv/config'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  collectCoverageFrom: ['src/**/{!(main.ts),}.ts'],
  coveragePathIgnorePatterns: ['dist/', 'node_modules/', '__tests__/'],
  verbose: true
};
