# Testing Guidelines

This document provides guidance on writing tests for the Digital Kudos Wall backend application, following our Standard Operating Procedure (SOP).

## Directory Structure

```
tests/
├── unit/
│   └── modules/
│       └── [ModuleName]/
│           └── [Layer]/
│               └── [Component]/
│                   └── [ComponentName].test.ts
├── integration/
│   └── modules/
│       └── [ModuleName]/
│           └── [Feature].integration.test.ts
└── e2e/
    └── modules/
        └── [ModuleName]/
            └── [Feature].e2e.test.ts
```

## Test Types

1. **Unit Tests**: Test individual components in isolation
   - Test use cases, domain entities, and controllers independently
   - Mock all dependencies
   - Located in `tests/unit/modules/[ModuleName]/...`

2. **Integration Tests**: Test how components work together
   - Test API endpoints, repositories with databases, etc.
   - Located in `tests/integration/modules/[ModuleName]/...`
   - File naming: `[Feature].integration.test.ts`

3. **E2E Tests**: Test complete user flows
   - Located in `tests/e2e/modules/[ModuleName]/...`
   - File naming: `[Feature].e2e.test.ts`

## Test Utilities

Shared test utilities are available in `tests/testUtils.ts`:

- Factory functions for test data generation
- Mock request/response helpers
- Authentication helpers
- Database mocking

## Best Practices

1. **Follow the SOP**: Refer to the testing SOP for detailed guidelines
2. **Test Coverage**: Aim for minimum 80% coverage, critical paths should have 100%
3. **Clean Setup/Teardown**: Each test should clean up after itself
4. **Descriptive Test Names**: Use clear naming that indicates what's being tested
5. **Arrange-Act-Assert**: Structure tests using the AAA pattern
6. **Mock Only What's Necessary**: Prefer integration tests with minimal mocking

## Example Test

```typescript
describe('UpdateUserRoleUseCase', () => {
  // Setup
  
  it('should update user role successfully', async () => {
    // Arrange
    // ...
    
    // Act
    const result = await useCase.execute({ /* params */ });
    
    // Assert
    expect(result).toHaveProperty('id');
    // ...
  });
});
``` 