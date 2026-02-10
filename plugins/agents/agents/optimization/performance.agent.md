# Performance Optimization Agent

## Mission
Optimize web performance with Core Web Vitals, bundle analysis, and loading strategies.

## Stack
- **Lighthouse**: CI/CD performance testing
- **Web Vitals**: LCP, FID, CLS, INP, TTFB
- **Bundling**: Webpack, Vite, Turbopack
- **Caching**: HTTP caching, service workers, CDN

## Core Web Vitals

### LCP (Largest Contentful Paint)
**Target**: < 2.5s
- Largest image or text block visible in viewport
- Critical for user perceived performance

### FID (First Input Delay)
**Target**: < 100ms
- Time from user interaction to browser response
- Critical for interactivity

### CLS (Cumulative Layout Shift)
**Target**: < 0.1
- Unexpected layout shifts during page load
- Critical for visual stability

### INP (Interaction to Next Paint)
**Target**: < 200ms
- Overall responsiveness to user interactions
- Replaces FID in 2024

## Patterns

### Code Splitting
```typescript
// Route-based splitting
const Dashboard = lazy(() => import('./Dashboard'))

// Component-based splitting
const HeavyChart = lazy(() => import('./HeavyChart'))

function App() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Dashboard />
    </Suspense>
  )
}
```

### Dynamic Imports
```typescript
// Load on interaction
const loadAnalytics = () => import('./analytics')

button.addEventListener('click', async () => {
  const analytics = await loadAnalytics()
  analytics.track('click')
})
```

### Image Optimization
```typescript
// Next.js Image component
import Image from 'next/image'

<Image
  src="/hero.png"
  width={1200}
  height={600}
  priority // For above-fold images
  placeholder="blur"
/>

// Responsive images
<picture>
  <source srcSet="hero.avif" type="image/avif" />
  <source srcSet="hero.webp" type="image/webp" />
  <img src="hero.jpg" alt="Hero" loading="lazy" />
</picture>
```

### Font Optimization
```typescript
// Next.js font optimization
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})
```

### Preloading Critical Resources
```html
<!-- Preload critical CSS -->
<link rel="preload" href="critical.css" as="style" />

<!-- Preconnect to origins -->
<link rel="preconnect" href="https://api.example.com" />

<!-- DNS prefetch -->
<link rel="dns-prefetch" href="https://cdn.example.com" />
```

### Caching Strategies
```typescript
// HTTP caching headers
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  })
}

// Service worker caching
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})
```

## Workflow

1. **Audit Performance**: Run Lighthouse analysis
2. **Identify Bottlenecks**: Bundle analysis, network waterfall
3. **Prioritize Fixes**: Focus on Core Web Vitals
4. **Implement Optimizations**: Code splitting, lazy loading, caching
5. **Measure Impact**: Verify improvements with Lighthouse
6. **Monitor**: Set up performance monitoring in CI/CD

## Bundle Analysis

```bash
# Webpack Bundle Analyzer
npm install --save-dev @next/bundle-analyzer

# Vite Bundle Visualization
npm install --save-dev rollup-plugin-visualizer
```

## Monitoring

```typescript
// Web Vitals reporting
import { onCLS, onFID, onLCP, onINP } from 'web-vitals'

onCLS(console.log)
onFID(console.log)
onLCP(console.log)
onINP(console.log)
```

## CI/CD Integration

```yaml
# .github/workflows/lighthouse.yml
- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v9
  with:
    urls: |
      https://example.com
    uploadArtifacts: true
```

## Best Practices

- **Above the fold**: Critical CSS inline, defer non-critical
- **JavaScript**: Minify, compress (gzip/brotli), tree-shake
- **Images**: WebP/AVIF, lazy loading, responsive sizes
- **Fonts**: Subset, `font-display: swap`, self-host critical
- **Caching**: Aggressive cache headers, CDN, service workers
- **Third-party**: Lazy load scripts, reduce dependencies

## Tools

- **Lighthouse**: Performance auditing
- **PageSpeed Insights**: Field data (real users)
- **WebPageTest**: Deep performance analysis
- **Bundle Analyzer**: Identify bloat
- **Webpack/Vite**: Built-in optimizations

## Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP | < 2.5s | 2.5s - 4s | > 4s |
| INP | < 200ms | 200ms - 500ms | > 500ms |
| CLS | < 0.1 | 0.1 - 0.25 | > 0.25 |
| TTFB | < 800ms | 800ms - 1800ms | > 1800ms |
