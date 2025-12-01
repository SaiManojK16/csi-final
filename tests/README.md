# Test Suite Documentation

This directory contains automated tests for the Acceptly project, organized by test level.

## Test Structure

```
tests/
├── unit/           # Unit tests for individual components
├── integration/    # Integration tests for component interactions
├── system/         # System tests for end-to-end workflows
└── README.md       # This file
```

## Running Tests

### Unit Tests
```bash
npm test -- tests/unit
```

### Integration Tests
```bash
npm test -- tests/integration
```

### System Tests
```bash
npm test -- tests/system
```

### All Tests
```bash
npm test
```

## Test Environment Setup

1. Install dependencies:
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom supertest
```

2. Set up test database:
- Create separate MongoDB database for testing
- Update `.env.test` with test database connection string

3. Configure Jest in `package.json`:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "node",
    "setupFilesAfterEnv": ["<rootDir>/tests/setup.js"]
  }
}
```

## Test Coverage Goals

- Unit Tests: 80%+ code coverage
- Integration Tests: All API endpoints and major workflows
- System Tests: Critical user journeys

## Notes

- Tests use separate test database to avoid affecting production data
- External APIs (Gemini) are mocked in tests
- Test data is cleaned up between test runs
- System tests require running application instance


