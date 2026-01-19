# Architecture Documentation

Technical architecture and design of the SMITE Statusline plugin.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [File Structure](#file-structure)
3. [Data Flow](#data-flow)
4. [Plugin Lifecycle](#plugin-lifecycle)
5. [Installation Process](#installation-process)
6. [Configuration System](#configuration-system)
7. [Error Handling](#error-handling)
8. [Extension Points](#extension-points)
9. [Performance Considerations](#performance-considerations)
10. [Future Enhancements](#future-enhancements)

---

## System Overview

### Purpose

The statusline plugin provides a comprehensive, auto-configuring status display for Claude Code with:

- **Git integration** - Branch, changes, staged/unstaged files
- **Session tracking** - Cost, duration, tokens, context percentage
- **Usage limits** - 5-hour and 7-day API limits with pacing
- **Spend tracking** - Daily and weekly cost tracking

### Design Philosophy

1. **Auto-configuration** - Zero setup required, works out of the box
2. **Modular features** - Optional features that can be deleted to disable
3. **Cross-platform** - Works on Windows, macOS, Linux with Bun or Node.js
4. **Fail-safe** - Graceful degradation when features are unavailable
5. **User control** - Extensive configuration options

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Claude Code                              │
├─────────────────────────────────────────────────────────────────┤
│  settings.json                                                   │
│  └─ statusLine.command → "bun .../index.ts"                     │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ stdin (JSON)
                            │ HookInput
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  Statusline Plugin (index.ts)                                   │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Config    │  │     Git     │  │   Context   │            │
│  │   Loader    │  │   Status    │  │  Calculator │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│         │                 │                  │                  │
│         └─────────────────┴──────────────────┘                  │
                           │                                       │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Optional Features (Pluggable)              │  │
│  │  ┌──────────────┐         ┌──────────────┐            │  │
│  │  │ Usage Limits │         │Spend Tracking│            │  │
│  │  │   limits.js  │         │   spend.js   │            │  │
│  │  └──────────────┘         └──────────────┘            │  │
│  └─────────────────────────────────────────────────────────┘  │
│                           │                                       │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Renderer (render-pure.ts)                  │  │
│  │         Formats and combines all sections               │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ stdout (string)
                            │ Statusline
                            ▼
                    ┌───────────────┐
                    │  Claude Code  │
                    │  UI Display   │
                    └───────────────┘
```

---

## File Structure

```
plugins/statusline/
├── .claude-plugin/
│   ├── plugin.json          # Plugin metadata
│   └── hooks/
│       └── hooks.json       # Post-install hooks
├── commands/
│   └── statusline.md        # CLI command documentation
├── hooks/
│   └── hooks.json           # Hook definitions
├── scripts/
│   ├── install.ts           # Installation script
│   ├── dist/                # Compiled JavaScript
│   └── statusline/
│       ├── src/
│       │   ├── index.ts     # Main entry point
│       │   ├── defaults.ts  # Default configuration
│       │   └── lib/
│       │       ├── config.ts        # Configuration management
│       │       ├── context.ts       # Context calculation
│       │       ├── formatters.ts    # Output formatting
│       │       ├── git.ts           # Git status
│       │       ├── render-pure.ts   # Statusline rendering
│       │       ├── types.ts         # TypeScript types
│       │       └── features/        # Optional features
│       │           ├── limits.js    # Usage limits
│       │           └── spend.js     # Spend tracking
│       ├── data/
│       │   └── defaults.json        # Default configuration
│       ├── statusline.config.json   # User configuration (symlink)
│       ├── package.json
│       └── tsconfig.json
├── skills/
│   └── (future skills)
└── README.md                 # This file
```

### Key Files Explained

#### `index.ts` - Main Entry Point

**Responsibilities:**
- Load configuration
- Parse HookInput from stdin
- Fetch all data (git, context, limits, spend)
- Render statusline
- Output to stdout

**Flow:**
```
1. Read stdin (HookInput)
2. Load config (statusline.config.json)
3. Get git status
4. Calculate context
5. Get usage limits (optional)
6. Get spend data (optional)
7. Render statusline
8. Print to stdout
```

#### `config.ts` - Configuration Management

**Responsibilities:**
- Define default configuration
- Merge user config with defaults
- Validate configuration
- Provide typed config access

#### `render-pure.ts` - Rendering Engine

**Responsibilities:**
- Pure rendering logic
- Format each section
- Combine sections with separators
- Handle one-line vs multi-line mode

**Key Function:**
```typescript
function renderStatusline(data: StatuslineData, config: StatuslineConfig): string
```

#### `formatters.ts` - Output Formatting

**Responsibilities:**
- Format costs ($1.23)
- Format durations (12m30s)
- Format tokens (123.4K)
- Format progress bars ([████░░░░])
- Format git branches

#### `git.ts` - Git Integration

**Responsibilities:**
- Execute git commands
- Parse git output
- Calculate changes
- Format git status

**Git Commands Used:**
```bash
git rev-parse --abbrev-ref HEAD    # Current branch
git status --porcelain             # File changes
git diff --shortstat               # Change counts
```

#### `context.ts` - Context Calculation

**Responsibilities:**
- Calculate usable context
- Determine context percentage
- Handle different context windows
- Support manual and automatic modes

**Calculation:**
```
Usable Context = maxContextTokens - autocompactBufferTokens - overheadTokens
Percentage = (tokensUsed / Usable Context) × 100
```

#### `features/` - Optional Features

**Design:**
- Dynamically imported with `try/catch`
- Silent failure if module missing
- Can be deleted to disable feature

**Files:**
- `limits.js` - Usage limits (5h/7d)
- `spend.js` - Spend tracking (daily/weekly)

---

## Data Flow

### Input: HookInput

```typescript
interface HookInput {
  cwd?: string;              // Current working directory
  tokens_used?: number;      // Tokens used in session
  cost?: number;             // Cost of session
  start_time?: number;       // Session start timestamp
  context_window?: number;   // Max context window
  usage_limits?: {           // Usage limit data
    five_hour: {...};
    seven_day: {...};
  };
}
```

### Processing Pipeline

```
┌─────────────────┐
│  HookInput      │
│  (stdin)        │
└────────┬────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│  1. Parse Input                                          │
│     - Extract tokens_used, cost, start_time              │
│     - Validate data types                                │
└────────┬─────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│  2. Load Configuration                                   │
│     - Read ~/.claude/statusline.config.json             │
│     - Merge with defaults                                │
│     - Validate config                                    │
└────────┬─────────────────────────────────────────────────┘
         │
         ├─────────────────────────────────────────────────┐
         │                                                 │
         ▼                                                 ▼
┌─────────────────────┐                         ┌─────────────────────┐
│  3. Git Status      │                         │  4. Context         │
│     - Get branch    │                         │     - Calculate     │
│     - Count changes │                         │       percentage    │
└────────┬────────────┘                         └────────┬────────────┘
         │                                                 │
         └──────────────────────┬──────────────────────────┘
                                │
         ┌──────────────────────┴──────────────────────┐
         │                                              │
         ▼                                              ▼
┌─────────────────────┐                    ┌─────────────────────┐
│ 5a. Usage Limits    │                    │ 5b. Spend Tracking  │
│     (optional)      │                    │     (optional)      │
│     - 5h/7d limits  │                    │     - Daily/weekly  │
└────────┬────────────┘                    └────────┬────────────┘
         │                                            │
         └────────────────────┬───────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────┐
│  6. Render Statusline                                    │
│     - Format each section                                │
│     - Apply colors/styles                                │
│     - Combine with separators                            │
└────────┬─────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│  Statusline     │
│  (stdout)       │
└─────────────────┘
```

### Output: Statusline

```
main • $1.23 • 45.2K • [████████░░] 78% • 12m30s
```

---

## Plugin Lifecycle

### 1. Installation

```bash
/plugin install statusline@smite
```

**Process:**
1. Claude downloads plugin to cache
2. Extracts to `~/.claude/plugins/cache/smite/statusline/1.0.0/`
3. Triggers `PostPluginInstall` hook
4. Runs `install.ts` or `dist/install.js`
5. Configures `settings.json`
6. Creates `statusline.config.json`
7. Logs to `~/.claude/logs/statusline-install.log`

### 2. Execution (Every Message)

**Trigger:** After each Claude response

**Process:**
1. Claude Code executes command from `settings.json`
2. Passes HookInput via stdin
3. Plugin runs `index.ts`
4. Outputs statusline to stdout
5. Claude Code displays in UI

### 3. Configuration Updates

**Trigger:** User edits `statusline.config.json`

**Process:**
1. User changes config file
2. Next execution loads new config
3. Statusline reflects changes immediately

### 4. Uninstallation

```bash
/plugin remove statusline
```

**Process:**
1. Removes plugin from cache
2. Removes statusLine from `settings.json`
3. User manually deletes `statusline.config.json`

---

## Installation Process

### install.ts Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Main Installation Flow                                 │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│  1. Detect Platform                                     │
│     - OS (windows/mac/linux)                            │
│     - Runtime (bun/node)                                │
│     - Paths (home, settings, cache)                     │
└────────┬────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│  2. Backup Existing Settings                            │
│     - Copy settings.json → settings.json.backup         │
└────────┬────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│  3. Read Current Settings                               │
│     - Parse JSON                                        │
│     - Validate syntax                                   │
└────────┬────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│  4. Configure Statusline                                │
│     - Add/update statusLine entry                       │
│     - Set command path                                  │
└────────┬────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│  5. Write Settings                                      │
│     - Atomic write (temp → rename)                      │
│     - JSON formatted                                    │
└────────┬────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│  6. Create Config File                                  │
│     - Copy defaults.json → ~/.claude/statusline.config  │
└────────┬────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│  7. Log Success                                         │
│     - Write to log file                                 │
│     - Display summary to user                           │
└─────────────────────────────────────────────────────────┘
```

### Error Handling

**Rollback Strategy:**
1. Catch any error during installation
2. Restore from `settings.json.backup`
3. Log error details
4. Exit with error code 1

**Example:**
```typescript
try {
  await install(options);
} catch (error) {
  // Rollback
  await fs.copyFile(backupPath, settingsPath);
  log.error('Installation failed, changes rolled back');
  process.exit(1);
}
```

---

## Configuration System

### Configuration Layers

```
1. Hard-coded Defaults (defaults.ts)
   ↓
2. Default Config File (data/defaults.json)
   ↓
3. User Config (~/.claude/statusline.config.json)
   ↓
4. Runtime Config (merged)
```

### Merge Strategy

```typescript
const runtimeConfig = {
  ...hardcodedDefaults,    // Layer 1
  ...defaultConfigFile,    // Layer 2
  ...userConfig           // Layer 3 (overrides)
};
```

### Configuration Schema

```typescript
interface StatuslineConfig {
  features: {
    usageLimits: boolean;
    spendTracking: boolean;
  };
  git: GitConfig;
  session: SessionConfig;
  context: ContextConfig;
  limits: LimitsConfig;
  weeklyUsage: WeeklyUsageConfig;
  dailySpend: DailySpendConfig;
}
```

### Validation

**Implicit Validation:**
- TypeScript types enforce structure
- Missing keys use defaults via spread operator
- Invalid values handled gracefully

**Example:**
```typescript
const userConfig = JSON.parse(content);
const merged = { ...defaultConfig, ...userConfig };
// If userConfig.git is missing, uses defaultConfig.git
```

---

## Error Handling

### Strategy

1. **Fail Gracefully** - Never crash the statusline
2. **Log Errors** - Write to log file for debugging
3. **Default Values** - Use safe defaults on error
4. **Silent Features** - Optional features fail silently

### Error Types

#### 1. Configuration Errors

```typescript
// Invalid JSON in config file
try {
  const config = JSON.parse(content);
} catch {
  return defaultConfig;  // Use defaults
}
```

#### 2. Git Errors

```typescript
// Git not installed or not in repo
const git = await getGitStatus();  // Returns null on error
```

#### 3. Feature Errors

```typescript
// Optional feature missing
try {
  const limits = await import('./features/limits.js');
} catch {
  // Feature not available - continue without it
  getUsageLimits = null;
}
```

#### 4. File System Errors

```typescript
// Can't read/write files
try {
  await atomicWrite(filePath, content);
} catch (error) {
  log.error(`Failed to write ${filePath}: ${error}`);
  // Continue with default behavior
}
```

### Error Logging

**Log Location:** `~/.claude/logs/statusline-install.log`

**Format:**
```
[2025-01-13T12:34:56.789Z] ERROR: Failed to read config file: ENOENT
```

**Logging Function:**
```typescript
async function writeLog(message: string, logPath: string): Promise<void> {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;

  try {
    await fs.appendFile(logPath, logMessage, 'utf-8');
  } catch {
    // Silently fail if logging fails
  }
}
```

---

## Extension Points

### Adding New Features

**Pattern:** Optional features in `lib/features/`

**Example:**
```typescript
// lib/features/weather.ts
export async function getWeather(location: string): Promise<string> {
  // Fetch weather data
  return "72°F Sunny";
}

// index.ts
let getWeather: ((loc: string) => Promise<string>) | null = null;

try {
  const weatherModule = await import('./lib/features/weather.js');
  getWeather = weatherModule.getWeather;
} catch {
  // Weather feature not available
}

// Use feature
const weather = getWeather ? await getWeather("San Francisco") : null;
```

### Adding New Formatters

**Location:** `lib/formatters.ts`

**Pattern:**
```typescript
export function formatCustom(value: number): string {
  // Format value
  return formattedString;
}
```

### Adding New Config Options

**Location:** `lib/types.ts` and `data/defaults.json`

**Pattern:**
```typescript
// types.ts
interface StatuslineConfig {
  newFeature: {
    enabled: boolean;
    option: string;
  };
}

// defaults.json
{
  "newFeature": {
    "enabled": false,
    "option": "default"
  }
}
```

### Adding New Progress Bar Styles

**Location:** `lib/render-pure.ts`

**Pattern:**
```typescript
function renderProgressBar(
  percentage: number,
  config: ProgressBarConfig
): string {
  const { style, length, color } = config;

  if (style === 'custom') {
    return renderCustomBar(percentage, length, color);
  }

  // Existing styles...
}
```

---

## Performance Considerations

### Execution Speed

**Target:** < 100ms per statusline update

**Optimizations:**
1. **Lazy imports** - Optional features imported only when needed
2. **Cached git operations** - Git status fetched once per update
3. **Minimal file I/O** - Config loaded once per execution
4. **Pure functions** - Rendering logic is side-effect free

### Memory Usage

**Target:** < 50MB RSS

**Optimizations:**
1. **No global state** - Each execution is isolated
2. **Streaming output** - stdout written immediately
3. **No persistent caching** - Data stored on disk, not in memory
4. **Minimal dependencies** - Only essential npm packages

### Disk I/O

**Minimizing Writes:**
1. **Atomic writes** - Temp file + rename (prevents corruption)
2. **Batched logging** - Log entries appended, not rewritten
3. **Config caching** - Config read once per execution

**File Access Pattern:**
```
Read: statusline.config.json (once)
Read: data/sessions.json (if spend tracking)
Read: .git/config (git operations)
Write: data/last_payload.txt (debug)
Write: data/sessions.json (if spend tracking)
Append: logs/statusline-install.log (errors)
```

---

## Future Enhancements

### Planned Features

1. **Custom Sections**
   - User-defined sections
   - Plugin API for third-party extensions

2. **Themes**
   - Predefined color schemes
   - Dark/light mode switching

3. **Widgets**
   - Clock/time display
   - System resource monitoring
   - Weather display

4. **Filters**
   - Path-based filtering
   - Project-specific configs

5. **Analytics**
   - Usage statistics
   - Cost trends
   - Session history

### Architecture Improvements

1. **Plugin System**
   ```typescript
   interface StatuslinePlugin {
     name: string;
     version: string;
     render(input: HookInput): Promise<string>;
   }
   ```

2. **Middleware**
   ```typescript
   type Middleware = (
     input: HookInput,
     next: () => Promise<StatuslineData>
   ) => Promise<StatuslineData>;
   ```

3. **Async Rendering**
   ```typescript
   // Stream updates as data becomes available
   async function* renderStream(
     input: HookInput
   ): AsyncGenerator<string> {
     yield renderGit();
     yield renderSession();
     yield renderLimits();
   }
   ```

---

## Technical Decisions

### Why Bun over Node.js?

- **Faster startup** - Bun's runtime is ~3x faster
- **Smaller bundle** - No need for node_modules
- **Built-in TypeScript** - No compilation step required

### Why Pure Functions for Rendering?

- **Testability** - Easy to unit test
- **Predictability** - Same input = same output
- **Performance** - No side effects to track

### Why Dynamic Imports for Features?

- **Modularity** - Features can be deleted to disable
- **Fail-safe** - Missing features don't crash plugin
- **Extensibility** - Easy to add new features

### Why JSON Config?

- **Human-readable** - Easy to edit manually
- **Standard** - Universal format
- **Simple** - No parser needed

---

## Contributing

### Code Style

- **TypeScript strict mode** - All files strictly typed
- **Pure functions** - No side effects where possible
- **Error handling** - Always handle errors gracefully
- **Comments** - Document complex logic

### Testing

```bash
# Test statusline manually
echo '{}' | bun src/index.ts

# Test installation
bun install.ts --dry-run

# Test git parsing
git status --porcelain
```

### Submitting Changes

1. Fork the repository
2. Create feature branch
3. Add tests (if applicable)
4. Update documentation
5. Submit pull request

---

## References

- [README.md](../../README.md) - User documentation
- [CONFIGURATION.md](../../CONFIGURATION.md) - Configuration reference
- [TROUBLESHOOTING.md](../../TROUBLESHOOTING.md) - Common issues
- [Claude Code API](https://docs.anthropic.com/claude/docs/claude-code) - HookInput reference

---

**Version:** 1.0.0
**Last Updated:** 2025-01-13
**Author:** Pamacea
