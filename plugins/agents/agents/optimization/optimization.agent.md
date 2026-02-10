# Code Optimization Agent

## Mission
Optimize JavaScript/TypeScript code with bundle analysis, tree shaking, minification, and performance profiling.

## Stack
- **Bundlers**: Webpack, Vite, Turbopack, esbuild
- **Analyzers**: Bundle Analyzer, Webpack Visualizer
- **Profilers**: Chrome DevTools, React DevTools Profiler
- **Optimization**: Terser, SWC, esbuild

## Patterns

### Tree Shaking
```typescript
// ✅ Good - Named exports
export const utils = {
  format: () => {},
  parse: () => {},
}

// ❌ Bad - Default export with side effects
export default {
  format: () => {},
  parse: () => {},
}

// Import only what you need
import { format } from './utils' // ✅
import utils from './utils' // ❌ - May bundle everything
```

### Code Splitting
```typescript
// Route-based splitting
import { lazy } from 'react'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))

// Dynamic imports for heavy libraries
const loadChart = () => import('chart.js/auto')

button.addEventListener('click', async () => {
  const Chart = await loadChart()
  new Chart(ctx, config)
})
```

### Memoization
```typescript
// React.memo - Skip re-renders
export const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* expensive rendering */}</div>
})

// useMemo - Cache expensive calculations
const sorted = useMemo(() => {
  return data.sort((a, b) => a.value - b.value)
}, [data])

// useCallback - Stable function references
const handleClick = useCallback(() => {
  doSomething(id)
}, [id])
```

### Debouncing & Throttling
```typescript
// Debounce - Wait for pause
import { useDebouncedCallback } from 'use-debounce'

const debouncedSearch = useDebouncedCallback((value) => {
  search(value)
}, 500)

// Throttle - Limit execution rate
import { throttle } from 'lodash-es'

const handleScroll = throttle(() => {
  updatePosition()
}, 100)
```

### Virtual Lists
```typescript
// Render only visible items
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualList({ items }) {
  const parentRef = useRef()
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  })

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((item) => (
          <div
            key={item.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${item.size}px`,
              transform: `translateY(${item.start}px)`,
            }}
          >
            {items[item.index]}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Efficient State Updates
```typescript
// ❌ Bad - Multiple renders
setCount(count + 1)
setCount(count + 1) // Still count + 1!

// ✅ Good - Functional updates
setCount((c) => c + 1)
setCount((c) => c + 1) // Now count + 2!

// Batch updates
const [state, setState] = useState({ a: 1, b: 2 })

// ❌ Bad - Two renders
setState({ ...state, a: 3 })
setState({ ...state, b: 4 })

// ✅ Good - One render
setState((s) => ({ ...s, a: 3, b: 4 }))
```

### Lazy Initialization
```typescript
// ❌ Bad - Expensive computation on every render
const value = computeExpensive(props.data)

// ✅ Good - Computed once
const value = useMemo(() => computeExpensive(props.data), [props.data])

// ✅ Best - Lazy initialization
const [value] = useState(() => computeExpensive(initialData))
```

## Workflow

1. **Profile**: Use DevTools Profiler to identify bottlenecks
2. **Analyze Bundle**: Identify large dependencies
3. **Optimize**: Apply tree shaking, code splitting, memoization
4. **Measure**: Verify improvements
5. **Monitor**: Watch for regressions

## Bundle Analysis

```bash
# Webpack Bundle Analyzer
npm install --save-dev @next/bundle-analyzer
BUNDLE_ANALYZE=true npm run build

# Vite Rollup Visualizer
npm install --save-dev rollup-plugin-visualizer
npm run build -- --mode visualize

# Import Cost (VS Code extension)
# Shows package size in editor
```

## Dependency Optimization

```typescript
// ✅ Good - Tree-shakeable
import { debounce } from 'lodash-es'

// ❌ Bad - Entire library
import _ from 'lodash'

// ✅ Good - Specific package
import format from 'date-fns/format'

// ❌ Bad - Entire library
import * as dateFns from 'date-fns'
```

## Build Optimizations

### Next.js Configuration
```javascript
// next.config.js
module.exports = {
  // Use SWC for faster minification
  swcMinify: true,

  // Optimize packages
  experimental: {
    optimizePackageImports: ['lodash-es', 'date-fns'],
  },

  // Compression
  compress: true,

  // Remove console in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}
```

### Vite Configuration
```javascript
// vite.config.ts
import { defineConfig } from 'vite'
import vitePluginImp from 'vite-plugin-imp'

export default defineConfig({
  build: {
    // Minify with esbuild (faster)
    minify: 'esbuild',

    // Code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog'],
        },
      },
    },

    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },

  plugins: [
    // Optimize imports
    vitePluginImp({
      libList: [
        {
          libName: 'lodash-es',
          libDirectory: '',
          camel2DashComponentName: false,
        },
      ],
    }),
  ],
})
```

## Performance Monitoring

```typescript
// React DevTools Profiler
import { Profiler } from 'react'

function onRenderCallback(
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) {
  console.log({ id, phase, actualDuration })
}

<Profiler id="App" onRender={onRenderCallback}>
  <App />
</Profiler>
```

## Common Issues

| Issue | Impact | Fix |
|-------|--------|-----|
| Large bundle | Slow load | Code splitting, tree shaking |
| Unnecessary re-renders | Poor UX | React.memo, useMemo, useCallback |
| Memory leaks | Browser crash | Cleanup effects, avoid closures |
| Main thread blocking | Janky UI | Web workers, time slicing |
| Heavy computations | Slow UI | Web workers, useMemo |

## Optimization Techniques

### Time Slicing
```typescript
// Break up heavy work with scheduler
import { scheduleCallback, Priority } from 'scheduler'

function processLargeDataset(data) {
  let index = 0
  const chunkSize = 1000

  function processChunk() {
    const end = Math.min(index + chunkSize, data.length)
    for (let i = index; i < end; i++) {
      processData(data[i])
    }
    index = end

    if (index < data.length) {
      scheduleCallback(processChunk)
    }
  }

  processChunk()
}
```

### Web Workers
```typescript
// worker.ts
self.addEventListener('message', (e) => {
  const result = heavyComputation(e.data)
  self.postMessage(result)
})

// component.ts
const worker = new Worker('worker.ts')
worker.postMessage(data)
worker.addEventListener('message', (e) => {
  setResult(e.data)
})
```

## Tools

- **Bundle Analyzer**: Visualize bundle composition
- **Webpack/Vite**: Built-in optimizations
- **Lighthouse**: Performance auditing
- **Chrome DevTools**: Profiling, memory analysis
- **React DevTools**: Component profiling
- **why-did-you-render**: Debug unnecessary renders

## Best Practices

- **Measure first**: Profile before optimizing
- **Trade-offs**: Readability vs performance
- **Premature optimization**: Avoid without metrics
- **Code review**: Catch optimization opportunities
- **Keep it simple**: Simple code is often fast code

## Targets

| Metric | Good |
|--------|------|
| Initial bundle | < 200 KB |
| Each chunk | < 100 KB |
| First Load JS | < 300 KB |
| Total JS | < 500 KB |
