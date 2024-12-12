// jest.config.js
module.exports = {
    preset: 'ts-jest',               // Use ts-jest preset for TypeScript support
    testEnvironment: 'node',          // Use Node.js environment for the tests
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',   // Transform TypeScript files using ts-jest
    },
    testMatch: ['**/tests/**/*.test.ts'],  // Pattern for test files
    moduleFileExtensions: ['ts', 'js'],    // Allow TypeScript and JavaScript files
  };
  