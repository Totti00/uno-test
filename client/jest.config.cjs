/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom', // Usa jsdom per il test di componenti React
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Trasforma i file TypeScript
    '^.+\\.jsx?$': 'babel-jest' // Trasforma i file JavaScript e JSX
  },
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
  setupFilesAfterEnv: ['./jest.setup.js'], // Nota l'uso di setupFilesAfterEnv
  transformIgnorePatterns: [
    "/node_modules/(?!some-module-to-transform|another-module)"
  ],
  moduleNameMapper: {
    '\\.css$': '<rootDir>/__mocks__/styleMock.js',
  },
};
