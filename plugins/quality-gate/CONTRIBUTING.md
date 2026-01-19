# Contributing to @smite/quality-gate

Thank you for your interest in contributing to the Smite Quality Gate! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title**: Descriptive summary of the issue
- **Description**: Detailed explanation of the problem
- **Steps to reproduce**: Minimal reproduction steps
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Environment**:
  - Node.js version
  - TypeScript version
  - Operating system
  - Smite version

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When suggesting an enhancement:

- Use a clear and descriptive title
- Provide a detailed description of the suggested enhancement
- Explain why this enhancement would be useful
- Provide examples of how the enhancement would be used
- List any potential implementation challenges

### Pull Requests

Pull requests are welcome! Follow these guidelines:

#### Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/smite.git
cd smite/plugins/quality-gate

# Install dependencies
npm install

# Build the project
npm run build

# Run linter
npm run lint

# Run type checker
npm run typecheck
```

#### Making Changes

1. **Create a branch**: From main, create a descriptive branch:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Follow coding standards**:
   - Use TypeScript for all new code
   - Follow existing code style and patterns
   - Add JSDoc comments for public APIs
   - Include error handling with Result types
   - Use Zod for all input validation

3. **Write tests** (if applicable):
   - Add unit tests for new functionality
   - Ensure all tests pass
   - Maintain test coverage above 80%

4. **Update documentation**:
   - Update README.md if user-facing features change
   - Add/update JSDoc comments
   - Update INSTALL.md if installation steps change
   - Update quality.example.json if config options change

5. **Commit changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   Use conventional commit messages:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting, etc.)
   - `refactor:` Code refactoring
   - `test:` Test additions or changes
   - `chore:` Build process or auxiliary tool changes

6. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a pull request on GitHub.

#### Pull Request Guidelines

- **Title**: Use the same conventional commit format as your commits
- **Description**: Include:
  - Summary of changes
  - Motivation for the change
  - Related issues (fixes #123)
  - Screenshots (if UI changes)
  - Breaking changes (if any)

- **Checks**: Ensure all CI checks pass:
  - TypeScript compilation
  - Linting
  - Tests
  - Build verification

## Development Guidelines

### Code Style

Follow the SMITE engineering rules from `.claude/rules/engineering.md`:

- **Zod Everywhere**: Parse, don't validate. Use Zod at entry points
- **Error Handling**: Use Result<T, E> types or try/catch with logging
- **Immutability**: Prefer pure functions and immutable data
- **Barrel Exports**: Export only necessary members via index.ts

### TypeScript Guidelines

- Use strict mode in tsconfig.json
- Avoid `any` type - use `unknown` or specific types
- Prefer interface for object shapes, type for unions/intersections
- Use type assertions sparingly - prefer type guards
- Enable strictNullChecks and noImplicitAny

### Testing Guidelines

- Write tests for all public APIs
- Test edge cases and error conditions
- Use descriptive test names
- Mock external dependencies
- Keep tests fast and isolated

### Documentation Guidelines

- **README**: User-facing documentation
- **JSDoc**: Code-level documentation for public APIs
- **Examples**: Provide usage examples for new features
- **Comments**: Explain "why", not "what" (code shows what)

## Project Structure

```
plugins/quality-gate/
├── src/
│   ├── analyzers/           # Complexity, security, semantic analyzers
│   ├── parser/              # TypeScript AST parser
│   ├── feedback/            # Feedback generator
│   ├── judge-hook.ts        # Main hook entry point
│   ├── logger.ts            # Audit logger
│   └── types.ts             # TypeScript definitions and Zod schemas
├── dist/                    # Compiled output (generated)
├── .smite/                  # Quality gate config (for testing)
├── README.md                # User documentation
├── INSTALL.md               # Installation guide
├── CONTRIBUTING.md          # This file
├── LICENSE                  # MIT License
├── package.json             # Package metadata
├── tsconfig.json            # TypeScript config
└── quality.example.json     # Example configuration
```

## Adding New Features

### New Validation Rules

To add a new validation rule:

1. **Define rule schema** in `src/types.ts`:
   ```typescript
   export const newRuleSchema = z.object({
     id: z.string(),
     enabled: z.boolean(),
     options: z.record(z.any()).optional()
   });
   ```

2. **Implement analyzer** in `src/analyzers/`:
   ```typescript
   export async function analyzeNewRule(
     ast: ts.SourceFile,
     config: z.infer<typeof newRuleSchema>
   ): Promise<ValidationResult[]> {
     // Implementation
   }
   ```

3. **Register in judge-hook.ts**:
   ```typescript
   const results = await Promise.all([
     analyzeComplexity(ast, config.complexity),
     analyzeSecurity(ast, config.security),
     analyzeSemantic(ast, config.semantic),
     analyzeNewRule(ast, config.newRule) // Add here
   ]);
   ```

4. **Update configuration**:
   - Add to `quality.example.json`
   - Update README with new rule documentation

### New Metrics

To add a new complexity metric:

1. **Define metric** in `src/analyzers/complexity.ts`
2. **Add configuration** to `quality.example.json`
3. **Update README** with metric explanation
4. **Add tests** for the metric

## Release Process

Releases are managed by maintainers:

1. Update version in package.json
2. Update CHANGELOG.md
3. Create git tag: `git tag v1.0.0`
4. Push tag: `git push origin v1.0.0`
5. Create GitHub release with notes
6. Publish to npm (if applicable)

## Community

- **Discussions**: Use GitHub Discussions for questions and ideas
- **Issues**: Use GitHub Issues for bugs and feature requests
- **PRs**: Pull requests are welcome and will be reviewed promptly

## Getting Help

- Read the [README](./README.md) for usage documentation
- Check existing [Issues](https://github.com/pamacea/smite/issues)
- Start a [Discussion](https://github.com/pamacea/smite/discussions)
- Ask in pull requests if you need clarification

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Acknowledgments

Thank you for contributing to the Smite Quality Gate! Your contributions help make code quality validation accessible to everyone.
