# Contributing to @smite/docs-editor-mcp

Thank you for your interest in contributing to the Smite Docs Editor MCP! This document provides guidelines and instructions for contributing.

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
  - MCP client being used
  - Configuration files

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
cd smite/plugins/docs-editor-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Start the MCP server
npm start
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
   - Follow SMITE engineering rules

3. **Write tests** (if applicable):
   - Add unit tests for new functionality
   - Ensure all tests pass
   - Maintain test coverage above 80%

4. **Update documentation**:
   - Update README.md if user-facing features change
   - Add/update JSDoc comments
   - Update INSTALL.md if installation steps change
   - Update docs-config.example.json if config options change

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
  - MCP tool schema changes (if applicable)

- **Checks**: Ensure all CI checks pass:
  - TypeScript compilation
  - Linting
  - Tests
  - Build verification
  - MCP protocol compliance

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

### MCP Guidelines

- Follow MCP specification for tool implementation
- Use Zod schemas for all tool parameters
- Return structured JSON responses
- Include error details in error responses
- Use proper MCP error codes

### Testing Guidelines

- Write tests for all MCP tools
- Test edge cases and error conditions
- Use descriptive test names
- Mock file system operations
- Test with various markdown formats
- Verify Zod schema validation

### Documentation Guidelines

- **README**: User-facing documentation
- **JSDoc**: Code-level documentation for public APIs
- **Examples**: Provide usage examples for new tools
- **Comments**: Explain "why", not "what" (code shows what)

## Project Structure

```
plugins/docs-editor-mcp/
├── src/
│   ├── tools/               # MCP tool implementations
│   │   └── update-readme.ts # README updater tool
│   ├── processors/          # Content processors
│   │   ├── dependency-monitor.ts
│   │   ├── structure-scanner.ts
│   │   ├── readme-parser.ts
│   │   └── readme-updater.ts
│   ├── types/               # TypeScript definitions and Zod schemas
│   │   └── readme-types.ts
│   ├── server.ts            # MCP server
│   └── index.ts             # Main exports
├── dist/                    # Compiled output (generated)
├── README.md                # User documentation
├── INSTALL.md               # Installation guide
├── CONTRIBUTING.md          # This file
├── LICENSE                  # MIT License
├── package.json             # Package metadata
└── tsconfig.json            # TypeScript config
```

## Adding New Features

### New MCP Tools

To add a new MCP tool:

1. **Define tool schema** in `src/types/`:
   ```typescript
   import { z } from 'zod';

   export const newToolSchema = z.object({
     param1: z.string(),
     param2: z.number().optional(),
     options: z.record(z.any()).optional()
   });
   ```

2. **Implement tool** in `src/tools/`:
   ```typescript
   export async function handleNewTool(
     args: z.infer<typeof newToolSchema>
   ): Promise<ToolResponse> {
     // Validate input
     const validated = newToolSchema.parse(args);

     // Implementation
     const result = await processNewTool(validated);

     return {
       success: true,
       data: result
     };
   }
   ```

3. **Register in server.ts**:
   ```typescript
   server.setRequestHandler(ListToolsRequestSchema, async () => ({
     tools: [
       {
         name: 'new_tool',
         description: 'Tool description',
         inputSchema: zodToJsonSchema(newToolSchema)
       },
       // ... existing tools
     ]
   }));
   ```

4. **Add handler**:
   ```typescript
   server.setRequestHandler(CallToolRequestSchema, async (request) => {
     if (request.params.name === 'new_tool') {
       return await handleNewTool(request.params.arguments);
     }
     // ... existing handlers
   });
   ```

5. **Update documentation**:
   - Add tool description to README.md
   - Update INSTALL.md with usage examples
   - Add to docs-config.example.json if relevant

### New Content Processors

To add a new content processor:

1. **Create processor** in `src/processors/`:
   ```typescript
   export async function processNewContent(
     content: string,
     options: ProcessOptions
   ): Promise<ProcessedContent> {
     // Implementation
   }
   ```

2. **Add type definitions** in `src/types/`:
   ```typescript
   export interface ProcessOptions {
     // Option definitions
   }
   ```

3. **Integrate with tools**:
   ```typescript
   const processed = await processNewContent(rawContent, options);
   ```

## MCP Protocol Compliance

All tools must follow MCP specification:

- Tool names must be snake_case
- Input schemas must use JSON Schema format
- Output must be structured JSON
- Errors must include error codes and messages
- Use appropriate HTTP status codes for errors

## Testing MCP Tools

### Manual Testing

```bash
# Start server
npm start

# In another terminal, test using MCP client
# or use echo/stdin to simulate MCP requests
```

### Automated Testing

```typescript
describe('New Tool', () => {
  it('should validate input schema', () => {
    expect(() => newToolSchema.parse({})).toThrow();
  });

  it('should process valid input', async () => {
    const result = await handleNewTool({ param1: 'test' });
    expect(result.success).toBe(true);
  });
});
```

## Release Process

Releases are managed by maintainers:

1. Update version in package.json
2. Update CHANGELOG.md
3. Create git tag: `git tag v1.0.0`
4. Push tag: `git push origin v1.0.0`
5. Create GitHub release with notes
6. Update MCP specification compliance

## Community

- **Discussions**: Use GitHub Discussions for questions and ideas
- **Issues**: Use GitHub Issues for bugs and feature requests
- **PRs**: Pull requests are welcome and will be reviewed promptly

## Getting Help

- Read the [README](./README.md) for usage documentation
- Check [MCP Specification](https://modelcontextprotocol.io/)
- Check existing [Issues](https://github.com/pamacea/smite/issues)
- Start a [Discussion](https://github.com/pamacea/smite/discussions)
- Ask in pull requests if you need clarification

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Acknowledgments

Thank you for contributing to the Smite Docs Editor MCP! Your contributions help make automatic documentation maintenance accessible to everyone.
