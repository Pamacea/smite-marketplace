# Test Runner Integration

## Overview

The Test Runner integration enhances the Quality Gate system with automatic test execution capabilities. When enabled, it runs test suites after static analysis and includes test failures in the validation feedback.

## Features

### Supported Test Frameworks

- **Jest** - JavaScript/TypeScript testing framework
- **Vitest** - Next-generation testing framework
- **Mocha** - JavaScript test framework
- **pytest** - Python testing framework

### Key Capabilities

1. **Automatic Framework Detection**
   - Scans `package.json` for test dependencies
   - Detects pytest in Python projects
   - Falls back gracefully if no framework is detected

2. **Test Execution**
   - Spawns test processes with configurable timeouts
   - Captures both stdout and stderr
   - Handles process termination on timeout

3. **Output Parsing**
   - Extracts test counts (passed, failed, skipped)
   - Parses failure messages with file locations
   - Captures stack traces for debugging

4. **Configuration Options**
   - Enable/disable test execution
   - Custom test commands
   - Configurable timeouts (default: 60 seconds)
   - Control whether failures block commits

## Configuration

Add test configuration to `.smite/quality.json`:

```json
{
  "tests": {
    "enabled": true,
    "command": "npm test --",
    "framework": "jest",
    "timeoutMs": 60000,
    "failOnTestFailure": true
  }
}
```

### Configuration Options

- **`enabled`** (boolean, default: `false`)
  - Enable or disable test execution
  - When disabled, tests are skipped gracefully

- **`command`** (string, optional)
  - Custom test command to run
  - If omitted, uses framework-specific defaults:
    - Jest: `npm test --`
    - Vitest: `npm test --`
    - Mocha: `npm test`
    - pytest: `pytest`

- **`framework`** (string, optional)
  - Explicitly specify the test framework
  - Options: `'jest'`, `'vitest'`, `'mocha'`, `'pytest'`, `'none'`
  - If omitted, auto-detected from project

- **`timeoutMs`** (number, default: `60000`)
  - Maximum time to wait for test completion (in milliseconds)
  - Process is terminated if timeout exceeded

- **`failOnTestFailure`** (boolean, default: `true`)
  - Whether test failures should block code changes
  - When `false`, failures are reported as warnings

## Integration with Validation Flow

### Execution Order

1. Static analysis (complexity, security, semantics)
2. **Test execution** (if enabled)
3. Decision making (allow/deny)
4. Feedback generation (if denied)

### Test Failures in Feedback

When tests fail, the correction prompt includes:

```
## Test Failures

- **MyComponent should render correctly**
   File: src/MyComponent.test.ts:42:10
   Error: Expected true to be false

- **API handler should return 200**
   File: src/api/handler.test.ts:15:5
   Error: Timeout - Async callback was not invoked
```

## Examples

### Example 1: Enable Tests for Jest Project

```json
{
  "tests": {
    "enabled": true,
    "timeoutMs": 120000
  }
}
```

Framework and command are auto-detected from `package.json`.

### Example 2: Custom Test Command

```json
{
  "tests": {
    "enabled": true,
    "command": "npm run test:unit",
    "timeoutMs": 30000
  }
}
```

### Example 3: Tests as Warnings

```json
{
  "tests": {
    "enabled": true,
    "failOnTestFailure": false
  }
}
```

Tests run but failures don't block commits (useful for WIP code).

### Example 4: Python pytest Project

```json
{
  "tests": {
    "enabled": true,
    "framework": "pytest",
    "command": "pytest tests/",
    "timeoutMs": 60000
  }
}
```

## Implementation Details

### File Structure

```
plugins/quality-gate/src/
├── test-runner.ts      # Main test execution module
├── judge.ts            # Orchestrator (integrates test runner)
├── feedback.ts         # Enhanced with test failure formatting
├── types.ts            # Test-related type definitions
└── config.ts           # Configuration merging
```

### Key Components

1. **TestRunner Class** (`test-runner.ts`)
   - `runTests()` - Main entry point
   - `detectFramework()` - Auto-detection logic
   - `executeTestCommand()` - Process spawning
   - `parseTestOutput()` - Framework-specific parsers

2. **Judge Integration** (`judge.ts`)
   - Instantiates `TestRunner`
   - Runs tests after static analysis
   - Adds test failures as validation issues
   - Includes test metrics in results

3. **Feedback Enhancement** (`feedback.ts`)
   - `formatTestFailure()` - Formats test failures
   - Added test failures section to correction prompts
   - Includes test summary in metrics

### Type Definitions

```typescript
export interface TestConfig {
  enabled: boolean;
  command?: string;
  framework?: FrameworkDetection;
  timeoutMs: number;
  failOnTestFailure: boolean;
}

export interface TestResults {
  passed: boolean;
  skipped: boolean;
  framework: 'jest' | 'vitest' | 'mocha' | 'pytest' | 'none';
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  failures: TestFailure[];
  executionTimeMs: number;
}

export interface TestFailure {
  testFile: string;
  testName: string;
  message: string;
  stackTrace?: string;
  line: number;
  column: number;
}
```

## Error Handling

The test runner handles various error scenarios:

1. **No Test Framework Detected**
   - Returns `skipped: true`
   - Does not block validation

2. **Test Command Timeout**
   - Process terminated with SIGTERM
   - Returns error as test failure
   - Logged with warning level

3. **Test Execution Error**
   - Captured and returned as single test failure
   - Includes error message and stack trace
   - Does not crash the hook

4. **Parsing Failures**
   - Graceful fallback to default values
   - Logs warning for debugging
   - Still allows validation to proceed

## Performance Considerations

- Test execution adds latency to validation (typically 1-60 seconds)
- Use `failOnTestFailure: false` for faster iteration during development
- Consider separate CI/CD pipeline for full test suites
- Configure appropriate `timeoutMs` based on test suite duration

## Future Enhancements

Potential improvements for future versions:

1. **Parallel Test Execution**
   - Run multiple test suites simultaneously
   - Reduce overall execution time

2. **Test Filtering**
   - Only run tests affected by changed files
   - Integration with coverage tools

3. **Caching**
   - Cache test results for unchanged code
   - Skip re-running passing tests

4. **Additional Frameworks**
   - JUnit support for Java projects
   - Go test support
   - RSpec support for Ruby

5. **Test Result Visualization**
   - Generate HTML test reports
   - Trend analysis over time

## Troubleshooting

### Tests Not Running

1. Check `tests.enabled` is `true` in config
2. Verify test command is correct
3. Check logs with `"logLevel": "debug"`
4. Ensure test framework is installed

### Timeout Issues

1. Increase `timeoutMs` value
2. Check for infinite loops or hanging async tests
3. Verify test command doesn't require interactive input

### Parsing Failures

1. Check test output format matches expected patterns
2. Try running test command manually to verify output
3. Enable debug logging to see raw test output
4. Consider using `--json` flag if available

## License

MIT License - See project LICENSE file for details.
