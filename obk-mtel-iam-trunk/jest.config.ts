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
      // branches: 95,
      // functions: 95,
      lines: 50,
      // statements: 95,
    },
  },
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/$1',
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/src/utils/kafka/*',
    '<rootDir>/src/libs/cache.ts',
    '<rootDir>/src/libs/tcc_client.ts',
  ],  
  testMatch: ['<rootDir>/tests/**/?(*.)+(spec|test).[jt]s?(x)'],
  globalSetup: './tests/helpers/jest.setup.ts',
  globalTeardown: './tests/helpers/jest.teardown.ts',
  modulePathIgnorePatterns: ['<rootDir>/src/utils/kafka/*'],
};
