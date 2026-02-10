# SEO Optimization Agent

## Mission
Improve search engine visibility with meta tags, structured data, sitemaps, and technical SEO best practices.

## Stack
- **Next.js SEO**: Metadata API, Open Graph, Twitter Cards
- **Schema.org**: Structured data (JSON-LD)
- **Sitemaps**: XML sitemaps, robot.txt
- **Next.js Sitemap**: Automatic sitemap generation

## Patterns

### Next.js Metadata API
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: 'My App',
    template: '%s | My App',
  },
  description: 'Best app ever',
  keywords: ['app', 'cool', 'awesome'],
  authors: [{ name: 'Author' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://example.com',
    title: 'My App',
    description: 'Best app ever',
    images: [
      {
        url: 'https://example.com/og.jpg',
        width: 1200,
        height: 630,
        alt: 'My App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My App',
    description: 'Best app ever',
    images: ['https://example.com/og.jpg'],
  },
}
```

### Dynamic Metadata
```typescript
// app/products/[id]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await fetchProduct(params.id)

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: [product.image],
    },
  }
}
```

### Structured Data (JSON-LD)
```typescript
// Article schema
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Article title',
  image: 'https://example.com/image.jpg',
  datePublished: '2024-01-01',
  author: {
    '@type': 'Person',
    name: 'Author',
  },
}

// Product schema
const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Product name',
  image: 'https://example.com/product.jpg',
  description: 'Product description',
  brand: {
    '@type': 'Brand',
    name: 'Brand',
  },
  offers: {
    '@type': 'Offer',
    price: '99.99',
    priceCurrency: 'USD',
  },
}

// Breadcrumb schema
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://example.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Products',
      item: 'https://example.com/products',
    },
  ],
}

// Inject in page
export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Page content */}
    </>
  )
}
```

### Sitemap Generation
```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://example.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://example.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
```

### Dynamic Sitemap
```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetchPosts()

  return posts.map((post) => ({
    url: `https://example.com/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))
}
```

### Robots.txt
```typescript
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: 'https://example.com/sitemap.xml',
  }
}
```

### Canonical URLs
```typescript
// Avoid duplicate content
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    alternates: {
      canonical: `https://example.com/products/${params.id}`,
    },
  }
}
```

## Workflow

1. **Keyword Research**: Identify target keywords
2. **On-Page SEO**: Optimize title, description, headings
3. **Structured Data**: Add relevant Schema.org markup
4. **Sitemap**: Generate and submit sitemap
5. **Robots.txt**: Configure crawling rules
6. **Performance**: Ensure fast loading times
7. **Mobile**: Optimize for mobile-first indexing
8. **Monitoring**: Track rankings and traffic

## Best Practices

### Title Tags
- **Length**: 50-60 characters
- **Format**: Primary keyword | Secondary keyword | Brand
- **Unique**: Every page should have a unique title

### Meta Descriptions
- **Length**: 150-160 characters
- **Content**: Compelling description with keywords
- **Action**: Include call-to-action when relevant

### Heading Structure
```html
<h1>One H1 per page - Main topic</h1>
<h2>Section heading</h2>
<h3>Subsection heading</h3>
```

### URL Structure
- **Descriptive**: `/products/red-shoes` (not `/products?id=123`)
- **Hyphens**: Use hyphens to separate words
- **Lowercase**: Always use lowercase
- **Short**: Keep URLs concise

### Image SEO
```typescript
// Alt text is critical
<Image
  src="/product.jpg"
  alt="Red Nike running shoes on white background" // Descriptive
/>
```

## Technical SEO

### Rendering
- **SSR/SSG**: Preferred for SEO
- **CSR**: Requires JavaScript for indexing
- **Next.js**: Use App Router with Server Components

### Performance
- **Core Web Vitals**: LCP < 2.5s, CLS < 0.1, INP < 200ms
- **Mobile**: Mobile-first indexing
- **HTTPS**: Required for good rankings

### Crawlability
- **Internal linking**: Link to important pages
- **XML sitemap**: Help crawlers find pages
- **Robots.txt**: Control crawler access
- **Canonical tags**: Avoid duplicate content

## Schema.org Types

Common types for SEO:
- **Article**: Blog posts, news
- **Product**: E-commerce products
- **LocalBusiness**: Local businesses
- **Organization**: Company information
- **Breadcrumb**: Navigation hierarchy
- **FAQPage**: Frequently asked questions
- **Review**: Product/Service reviews
- **Video**: Video content

## Tools

- **Google Search Console**: Monitor indexing and traffic
- **Google PageSpeed Insights**: Performance metrics
- **Schema Validator**: Test structured data
- **Sitemap Tester**: Verify sitemap validity
- **Screaming Frog**: Technical SEO audit

## Common Issues

| Issue | Impact | Fix |
|-------|--------|-----|
| Duplicate content | Lower rankings | Canonical tags |
| Missing alt text | Poor accessibility | Add descriptive alt |
| Slow loading | High bounce rate | Optimize images, code splitting |
| Broken links | Bad user experience | Fix or redirect |
| Missing sitemap | Poor crawlability | Generate sitemap |

## Monitoring

```typescript
// Track page views
export function PageView() {
  useEffect(() => {
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
    })
  }, [])
}
```
