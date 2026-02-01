/**
 * Post-installation hook for @smite/implement
 *
 * Creates configuration file and displays welcome message
 */

const fs = require('fs');
const path = require('path');

function getConfigPath() {
  return path.join(process.cwd(), '.claude/.smite/implement.json');
}

function createConfig() {
  const configPath = getConfigPath();
  const configDir = path.dirname(configPath);

  // Create .claude/.smite/ directory if it doesn't exist
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  // Create default config if it doesn't exist
  if (!fs.existsSync(configPath)) {
    const defaultConfig = {
      defaults: {
        mode: 'builder',
        techStack: 'detect',
        timeLimit: '60m',
        autoCommit: true
      },
      modes: {
        quick: {
          timeLimit: '10m',
          skipPlanning: true,
          parallelSubagents: 2,
          testing: 'lint+typecheck'
        },
        epct: {
          phases: ['explore', 'plan', 'code', 'test'],
          timePerPhase: '15m',
          skipPhases: []
        },
        builder: {
          steps: ['explore', 'design', 'implement', 'test', 'verify'],
          skipSteps: [],
          timePerStep: '12m'
        },
        predator: {
          steps: ['init', 'analyze', 'plan', 'execute', 'validate', 'examine', 'resolve', 'finish'],
          loadOnDemand: true,
          timePerStep: '10m'
        },
        ralph: {
          parallel: true,
          maxParallel: 3,
          autoGeneratePRD: true
        }
      },
      techStacks: {
        nextjs: {
          description: 'React 19, RSC, Prisma, Server Actions',
          features: ['rsc', 'prisma', 'server-actions', 'tanstack-query', 'shadcn', 'tailwind'],
          patterns: ['app/', 'components/ui/', 'lib/', 'validation/']
        },
        rust: {
          description: 'Ownership, async/await, zero-copy',
          features: ['ownership', 'async', 'zero-copy', 'result', 'derive'],
          patterns: ['src/models/', 'src/services/', 'src/handlers/', 'src/repositories/', 'src/error.rs']
        },
        python: {
          description: 'Type hints, FastAPI, SQLAlchemy 2.0',
          features: ['type-hints', 'fastapi', 'sqlalchemy', 'async'],
          patterns: ['src/models/', 'src/services/', 'src/api/', 'src/repositories/', 'src/main.py']
        },
        go: {
          description: 'Goroutines, interfaces, standard library',
          features: ['goroutines', 'interfaces', 'context', 'stdlib'],
          patterns: ['src/models/', 'src/services/', 'src/handlers/', 'src/repository/', 'src/main.go']
        }
      },
      detect: {
        description: 'Auto-detect from package.json and file patterns',
        patterns: {
          nextjs: ['package.json', 'next.config.js', 'src/app/', 'components/'],
          rust: ['Cargo.toml', 'src/main.rs', 'src/lib.rs'],
          python: ['requirements.txt', 'setup.py', 'src/main.py', 'src/api/'],
          go: ['go.mod', 'src/main.go', 'src/lib/']
        }
      },
      exclude: [
        'node_modules/**',
        'dist/**',
        '.claude/**',
        'build/**',
        '*.min.js',
        '*.map',
        '.git/**',
        'target/**'
      ],
      output: {
        directory: '.claude/.smite',
        artifacts: 'artifacts/implement/',
        format: 'markdown',
        timestamps: true
      },
      integration: {
        explore: {
          enabled: true,
          mode: 'quick'
        },
        refactor: {
          enabled: true,
          mode: 'full'
        },
        grepai: {
          enabled: false,
          reason: 'Use /explore for semantic search'
        }
      }
    };

    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    console.log('✅ Created config:', configPath);
  } else {
    console.log('ℹ️  Config already exists:', configPath);
  }
}

function displayWelcome() {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║     🎯 @smite/implement - Unified Implementation Agent  ║
╚══════════════════════════════════════════════════════════╝

🚀 Quick Start:

  # Quick implementation (like /oneshot)
  /implement --quick "Add user profile page"

  # Structured 4-phase (like /epct)
  /implement --epct "Build a complete dashboard"

  # Technical 5-step (like /builder)
  /implement --builder --tech=nextjs "Add authentication"

  # Modular 8-step (like /predator)
  /implement --predator "Implement shopping cart"

  # Parallel orchestration (like /ralph)
  /implement --ralph "Build full SaaS platform"

📚 Documentation:

  - README: plugins/implement/README.md
  - Skill: plugins/implement/skills/implement/SKILL.md
  - Guide: docs/IMPLEMENT_GUIDE.md
  - Examples: plugins/implement/examples/

🔧 Configuration:

  Config: .claude/.smite/implement.json
  Auto-detect tech stack: enabled

🔄 Integration:

  - Uses: /explore for context gathering
  - Compatible with: /refactor for quality assurance
  - Works with: All SMITE agents

📊 Modes Comparison:

  ┌─────────────┬──────────┬───────────┬──────────┬────────────┬─────────────┐
  │   Mode      │  Speed   │  Quality  │  Scope    │ Complexity │   Best For   │
  ├─────────────┼──────────┼───────────┼──────────┼────────────┼─────────────┤
  │ --quick     │ ⚡⚡⚡   │ ⚡⚡      │ Small     │ Low        │ Quick fixes  │
  │ --epct      │ ⚡⚡     │ ⚡⚡⚡    │ Medium    │ Medium     │ Complex feat │
  │ --builder   │ ⚡       │ ⚡⚡⚡⚡ │ Large     │ High       │ Tech-specific│
  │ --predator  │ ⚡⚡     │ ⚡⚡⚡⚡ │ Large     │ High       │ Systematic  │
  │ --ralph     │ ⚡⚡     │ ⚡⚡⚡⚡ │ Very Large│ Very High  │ Large projects│
  └─────────────┴──────────┴───────────┴──────────┴────────────┴─────────────┘

📄 Technical Subagents (from MOBS):

  - impl-nextjs - React 19, RSC, Prisma, Server Actions
  - impl-rust - Ownership, async/await, zero-copy
  - impl-python - Type hints, FastAPI, SQLAlchemy 2.0
  - impl-go - Goroutines, interfaces, stdlib

📝 Migration:

  From /oneshot    → /implement --quick
  From /epct        → /implement --epct
  From /builder     → /implement --builder --tech=nextjs|rust|python|go
  From /predator    → /implement --predator
  From /ralph/feature→ /implement --ralph

✨ Happy implementing!
  `);
}

function main() {
  try {
    createConfig();
    displayWelcome();
  } catch (error) {
    console.error('❌ Installation failed:', error.message);
    process.exit(1);
  }
}

main();
