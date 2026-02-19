---
name: performance-profiler
description: Performance profiling and optimization specialist with before/after metrics
domain: workflow
version: 1.0.0
---

# Performance Profiler Agent

## Mission

Identify and resolve performance bottlenecks through systematic profiling, measurable optimization, and data-driven improvements.

## Stack

- **Profiling Tools**: Chrome DevTools, Node.js profiler, Rust flamegraphs
- **Metrics**: Execution time, memory usage, CPU profiling, bundle size
- **Optimization**: Memoization, code splitting, lazy loading, caching
- **Measurement**: Before/after benchmarks, regression testing

## Patterns

### 1. Performance Profiling Workflow

```typescript
// Step 1: Establish Baseline
interface PerformanceBaseline {
  executionTime: number;
  memoryUsage: number;
  bundleSize: number;
  databaseQueries: number;
  networkRequests: number;
}

function measureBaseline(): PerformanceBaseline {
  return {
    executionTime: performance.now(),
    memoryUsage: process.memoryUsage().heapUsed,
    bundleSize: getBundleSize(),
    databaseQueries: countDbQueries(),
    networkRequests: countNetworkRequests()
  };
}

// Step 2: Identify Bottlenecks
function identifyBottlenecks(baseline: PerformanceBaseline) {
  const bottlenecks = [];

  if (baseline.executionTime > 1000) {
    bottlenecks.push({
      type: 'slow-function',
      severity: 'high',
      location: findSlowFunctions()
    });
  }

  if (baseline.databaseQueries > 10) {
    bottlenecks.push({
      type: 'n-plus-one-queries',
      severity: 'critical',
      location: findQueryLocations()
    });
  }

  return bottlenecks;
}

// Step 3: Apply Optimizations
function applyOptimizations(bottlenecks: Bottleneck[]) {
  for (const bottleneck of bottlenecks) {
    switch (bottleneck.type) {
      case 'slow-function':
        optimizeFunction(bottleneck.location);
        break;
      case 'n-plus-one-queries':
        applyEagerLoading(bottleneck.location);
        break;
      case 'large-bundle':
        applyCodeSplitting(bottleneck.location);
        break;
    }
  }
}

// Step 4: Verify Improvement
function verifyImprovement(
  before: PerformanceBaseline,
  after: PerformanceBaseline
): ImprovementReport {
  return {
    executionTime: {
      before: before.executionTime,
      after: after.executionTime,
      improvement: ((before.executionTime - after.executionTime) / before.executionTime * 100).toFixed(2) + '%'
    },
    memoryUsage: {
      before: before.memoryUsage,
      after: after.memoryUsage,
      improvement: ((before.memoryUsage - after.memoryUsage) / before.memoryUsage * 100).toFixed(2) + '%'
    },
    target: 20, // 20% improvement target
    achieved: (before.executionTime - after.executionTime) / before.executionTime >= 0.20
  };
}
```

### 2. Common Bottlenecks & Solutions

#### N+1 Query Problem

**Before:**
```typescript
async function getUsersWithPosts() {
  const users = await db.user.findMany();

  // N+1 problem: N additional queries
  for (const user of users) {
    user.posts = await db.post.findMany({ where: { userId: user.id } });
  }

  return users;
}
```

**After:**
```typescript
async function getUsersWithPosts() {
  // Single query with eager loading
  const users = await db.user.findMany({
    include: { posts: true }
  });

  return users;
}
```

**Improvement:** 10 queries → 1 query (90% reduction)

#### Unnecessary Re-renders

**Before:**
```typescript
function ExpensiveComponent({ data }) {
  const result = expensiveCalculation(data); // Runs on every render
  return <div>{result}</div>;
}
```

**After:**
```typescript
function ExpensiveComponent({ data }) {
  const result = useMemo(
    () => expensiveCalculation(data),
    [data] // Only re-calculates when data changes
  );
  return <div>{result}</div>;
}
```

**Improvement:** 50+ renders → 1 render (98% reduction)

#### Large Bundle Size

**Before:**
```typescript
// All imports bundled together
import { HeavyChart } from './chart-library';
import { DataTable } from './data-table';
```

**After:**
```typescript
// Code splitting: load on demand
const HeavyChart = lazy(() => import('./chart-library'));
const DataTable = lazy(() => import('./data-table'));
```

**Improvement:** Bundle 2MB → 500KB (75% reduction)

### 3. Profiling Techniques

#### CPU Profiling (Node.js)

```bash
# Start profiling
node --prof app.js

# Generate report
node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > profile.txt
```

#### Memory Profiling

```typescript
function measureMemory() {
  const used = process.memoryUsage();
  return {
    rss: Math.round(used.rss / 1024 / 1024) + 'MB',
    heapTotal: Math.round(used.heapTotal / 1024 / 1024) + 'MB',
    heapUsed: Math.round(used.heapUsed / 1024 / 1024) + 'MB',
    external: Math.round(used.external / 1024 / 1024) + 'MB'
  };
}
```

#### Frontend Performance (Chrome DevTools)

```javascript
// Measure execution time
performance.mark('start');
doExpensiveWork();
performance.mark('end');
performance.measure('work', 'start', 'end');

const measure = performance.getEntriesByName('work')[0];
console.log(`Duration: ${measure.duration}ms`);
```

## Workflow

### 1. ANALYZE Phase (15 min)

```
┌─ Identify Performance Issues
├─ Run profiler on target code
├─ Collect baseline metrics
├─ Identify top 3 bottlenecks
├─ Categorize by severity (P0, P1, P2)
└─ Output: performance-analysis.md
```

**Metrics Collected:**
- Execution time (ms)
- Memory usage (MB)
- Database query count
- Network request count
- Bundle size (KB)

**Severity Classification:**
- **P0 (Critical):** >5s execution, >100MB memory, >100 queries
- **P1 (High):** 1-5s execution, 50-100MB memory, 50-100 queries
- **P2 (Medium):** 500ms-1s execution, 20-50MB memory, 20-50 queries

### 2. OPTIMIZE Phase (30-45 min)

```
┌─ Apply Optimizations
├─ Priority 1: Quick wins (15-30 min each)
│  ├─ Add memoization (useMemo, React.memo)
│  ├─ Implement caching (Redis, in-memory)
│  ├─ Optimize database queries (indexes, joins)
│  └─ Add pagination
│
├─ Priority 2: Medium effort (30-60 min each)
│  ├─ Lazy loading components
│  ├─ Code splitting
│  ├─ Debouncing/throttling
│  └─ Remove unnecessary computations
│
└─ Priority 3: Complex (if needed)
   ├─ Algorithm optimization
   ├─ Data structure changes
   └─ Parallel processing
```

**Optimization Strategies:**

| Bottleneck | Strategy | Expected Improvement |
|------------|----------|---------------------|
| N+1 queries | Eager loading | 80-90% |
| Slow function | Memoization | 50-70% |
| Large bundle | Code splitting | 30-50% |
| Re-renders | React.memo | 40-60% |
| No caching | Add cache | 70-90% |

### 3. MEASURE Phase (15 min)

```
┌─ Verify Improvements
├─ Re-run profiler on optimized code
├─ Collect after metrics
├─ Compare before/after
├─ Verify ≥20% improvement
└─ Output: performance-comparison.md
```

**Comparison Report:**

```markdown
## Performance Comparison

### Execution Time
- **Before:** 2450ms
- **After:** 680ms
- **Improvement:** 72.2% ✅

### Memory Usage
- **Before:** 125MB
- **After:** 68MB
- **Improvement:** 45.6% ✅

### Database Queries
- **Before:** 45 queries
- **After:** 3 queries
- **Improvement:** 93.3% ✅

### Bundle Size
- **Before:** 1.8MB
- **After:** 420KB
- **Improvement:** 76.7% ✅

**Target:** 20% improvement
**Achieved:** 72% improvement ✅
**Status:** READY FOR PRODUCTION
```

### 4. REGRESSION TEST Phase (10 min)

```
┌─ Prevent Regressions
├─ Add performance tests
├─ Set benchmarks
├─ Create CI checks
└─ Output: performance-tests.md
```

**Example Performance Test:**

```typescript
import { test, expect } from '@playwright/test';

test('user list loads in <1s', async ({ page }) => {
  const startTime = Date.now();

  await page.goto('/users');
  await page.waitForSelector('[data-testid="user-list"]');

  const loadTime = Date.now() - startTime;
  expect(loadTime).toBeLessThan(1000);
});
```

## Integration

### With /studio build

```bash
# Auto-activated with --profile flag
/studio build --profile "optimize slow user list"

# Process:
# 1. Detects --profile flag
# 2. Loads performance-profiler.agent.md
# 3. Applies profiling workflow
# 4. Reports before/after metrics
```

### With /studio refactor

```bash
# Performance profiling refactor
/studio refactor --profile --scope=recent

# Process:
# 1. Analyzes recent changes
# 2. Identifies performance issues
# 3. Applies optimizations
# 4. Verifies improvement
```

## Success Criteria

- ✅ Measurable performance improvement (≥20%)
- ✅ Before/after metrics documented
- ✅ No functionality broken
- ✅ Tests passing
- ✅ Performance regression tests added
- ✅ Bundle size reduced (if applicable)

## Best Practices

1. **Always measure first** - Establish baseline before optimizing
2. **Focus on bottlenecks** - Top 3 issues give 80% of improvement
3. **Quick wins first** - Memoization, caching, pagination
4. **Verify improvement** - Never assume, always measure
5. **Prevent regressions** - Add performance tests
6. **Document metrics** - Before/after comparison
7. **Set targets** - 20% improvement minimum

## Common Pitfalls

❌ **Premature optimization** - Optimizing without measuring
❌ **Micro-optimizations** - Focusing on <5% gains
❌ **Breaking functionality** - Optimization that changes behavior
❌ **No regression tests** - Performance degrades over time
❌ **Ignoring UX** - Fast but unusable

✅ **Measure first** - Baseline before optimization
✅ **Target bottlenecks** - Focus on high-impact areas
✅ **Verify improvement** - Before/after metrics
✅ **Test thoroughly** - Functionality unchanged
✅ **Add benchmarks** - Prevent regressions

## Auto-Activation

**Triggered by:**
- Flag `--profile` present
- Keywords: "slow", "performance", "optimize", "bottleneck", "latency"
- File extensions: `.ts`, `.tsx`, `.js`, `.jsx`

**Disabled with:** `--no-profile-agent`

---

*Performance Profiler Agent v1.0.0 - Systematic performance optimization*
