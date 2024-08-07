/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom', // Usa jsdom per il test di componenti React
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Trasforma i file TypeScript
    '^.+\\.jsx?$': 'babel-jest' // Trasforma i file JavaScript e JSX
  },
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'], // Cerca i file di test
  setupFilesAfterEnv: ['./jest.setup.js'], // Nota l'uso di setupFilesAfterEnv
  transformIgnorePatterns: [
    "/node_modules/(?!some-module-to-transform|another-module)"
  ],
  moduleNameMapper: {
    '\\.module\\.css$': 'identity-obj-proxy',
    '\\.css$': '<rootDir>/__mocks__/styleMock.js',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}', // Includi tutti i file TypeScript nella cartella src
    '!src/**/*.d.ts',    // Escludi i file di definizione TypeScript
    '!src/**/index.ts'   // Escludi i file index.ts
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
};
