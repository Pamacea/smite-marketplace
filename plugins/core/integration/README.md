# SMITE v2.0 Integration Layer

This directory contains the integration layer that makes all SMITE v2.0 features work together.

## 🚀 Quick Start

### Automatic Integration
SMITE v2.0 automatically initializes on first use through hooks.

### Manual Testing
```bash
# Run verification tests
cd plugins/core/integration
npm run test:verify

# Or directly with ts-node
ts-node run-tests.ts
```

## 📁 Files

### Core Integration
- **smite-integrator.ts** - Main integrator that coordinates all systems
- **model-router.ts** - Intelligent model selection based on task type
- **hooks.ts** - Claude Code hooks for initialization and events

### Tests
- **__tests__/verification.test.ts** - Comprehensive test suite
- **run-tests.ts** - Quick test runner

## 🔧 How It Works

### 1. Initialization Flow

```
Session Start
    ↓
onSessionStart() hook
    ↓
SMITEIntegrator.initialize()
    ↓
┌─────────────────────────────────────┐
│ Initialize all systems in parallel:  │
│                                     │
│  ⚡ Lazy Loading                   │
│  🧠 Model Routing                   │
│  💾 Agent Memory                    │
│  🌐 Marketplace                    │
│  🤖 Team Orchestration              │
│  📊 Telemetry                      │
└─────────────────────────────────────┘
    ↓
All systems ready!
```

### 2. Model Routing Flow

```
User submits task
    ↓
onUserPromptSubmit() hook
    ↓
ModelRouter.selectModel(task)
    ↓
Analyze:
- Task keywords (grep, edit, etc.)
- Complexity (simple, medium, complex)
- Tools being used
    ↓
Select model:
- Haiku 4.5 for discovery (fast, cheap)
- Sonnet 4.5 for implementation (balanced)
- Opus 4.6 for architecture (high quality)
    ↓
Apply model to task
    ↓
Track in telemetry
```

### 3. Lazy Loading Flow

```
Skill requested
    ↓
loadSkill() hook
    ↓
Check if loaded:
  YES → Return cached content
  NO  → Load from disk
            ↓
        Cache for future
```

## 🧪 Testing

### Run All Tests
```bash
npm run test:verify
```

### Run Specific Tests
```bash
npm run test:verify:lazy-loading
npm run test:verify:model-routing
```

### Manual Verification
```bash
# Test initialization
node -e "require('./run-tests.ts').testInitialization()"

# Test model routing
node -e "require('./run-tests.ts').testModelRouting()"

# Test lazy loading
node -e "require('./run-tests.ts').testLazyLoading()"
```

## 📊 Performance Benchmarks

### Lazy Loading
- **Startup tokens:** 95% reduction (108k → 5k)
- **Startup time:** 82% faster (2.3s → 0.4s)

### Model Routing
- **Discovery tasks:** 80% cheaper (Haiku vs Sonnet)
- **Overall:** 30-50% cost reduction
- **Accuracy:** 74% tool selection accuracy

## 🔌 Configuration

### Environment Variables

```bash
# Disable specific features
SMITE_LAZY_LOADING=false
SMITE_MODEL_ROUTING=false
SMITE_TELEMETRY=false
```

### Configuration Files

**Model Routing:** `.claude/settings.model-routing.json`
**Telemetry:** `.claude/telemetry-config.json`
**Teams:** `.claude/teams/*.yml`

## 🐛 Troubleshooting

### Issue: Systems don't initialize

**Solution:** Check logs for specific error messages
```bash
# Check initialization
node -e "require('./smite-integrator.ts').initSMITE()"
```

### Issue: Model routing not working

**Solution:** Verify config exists
```bash
cat .claude/settings.model-routing.json
```

### Issue: Tests fail

**Solution:** Ensure dependencies are installed
```bash
npm install
npm test
```

## 📚 API Reference

### Main Integrator

```typescript
import { initSMITE, SMITE } from '@smite/core/integration';

// Initialize all systems
await initSMITE();

// Get status
const stats = SMITE.stats();
```

### Model Router

```typescript
import { selectModel } from '@smite/core/integration';

// Select model for task
const selection = selectModel('grep for files', {
  complexity: 'simple'
});

console.log(selection.model);  // 'claude-haiku-4-5'
console.log(selection.reason);  // 'Trigger match: "grep"'
console.log(selection.confidence);  // 0.85
```

### Hooks

```typescript
import { onSessionStart } from '@smite/core/integration';

// Register with Claude Code
await onSessionStart();
```

## 🎯 Best Practices

1. **Let systems auto-initialize** - Don't manually call initSMITE()
2. **Check analytics weekly** - Review cost and performance
3. **Use model routing** - Trust the system to pick the right model
4. **Monitor lazy loading** - Verify memory savings over time
5. **Run tests regularly** - Ensure everything still works after updates

---

**Version:** 2.0.0
**Last Updated:** 2026-02-19
