export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // This tells Jest to collect coverage information
  collectCoverage: true,
  // Only include coverage for files within the src directory
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}',
    '!<rootDir>/src/server.ts', // Exclude server.ts from coverage
  ],
  coverageThreshold: {
    global: {
      lines: 0,
      // statements: 95,
    },
  },
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['<rootDir>/tests/**/?(*.)+(spec|test).[jt]s?(x)'],
  globalSetup: './tests/helpers/jest.setup.ts',
  globalTeardown: './tests/helpers/jest.teardown.ts',
  coveragePathIgnorePatterns: ['<rootDir>/src/utils/kafka/*'],
  modulePathIgnorePatterns: ['<rootDir>/src/utils/kafka/*'],
};
