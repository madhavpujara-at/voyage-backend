module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'], // Look for tests in src and a dedicated tests folder
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\.(ts|tsx)$': ['ts-jest', { // or other TypeScript transformer
      tsconfig: 'tsconfig.json'
    }]
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1' // To handle path aliases like @/ from tsconfig
  },
  // reporters: [ "default", "jest-junit" ], // Optional: for CI reporting
  // coverageThreshold: { // Optional: enforce coverage
  //   global: {
  //     branches: 80,
  //     functions: 80,
  //     lines: 80,
  //     statements: -10
  //   }
  // },
  // collectCoverageFrom: [
  //   'src/**/*.{ts,tsx}',
  //   '!src/**/*.d.ts', // Exclude type definition files
  //   '!src/server.ts', // Usually, the main server entry point is harder to test fully
  //   '!src/config/**', // Exclude config files
  //   '!src/prisma/**' // Exclude Prisma generated client / schema files
  // ]
}; 