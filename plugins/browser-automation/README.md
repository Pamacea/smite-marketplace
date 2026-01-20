# 🌐 SMITE Browser Automation

[![npm version](https://badge.fury.io/js/@smite/browser-automation.svg)](https://www.npmjs.com/package/@smite/browser-automation)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Browser automation plugin for SMITE** - Automate web browsing, search, screenshots, and more using Playwright.

## ✨ Features

- 🌐 **Web Navigation** - Go to any URL
- 🔍 **Search** - Google, YouTube, Bing search automation
- 📸 **Screenshots** - Capture page screenshots
- 🖱️ **Interaction** - Click, fill forms, extract content
- 🎭 **Headless or Headed** - Run with or without browser UI
- ⚡ **Fast & Reliable** - Powered by Playwright
- 🔧 **Auto-Installation** - Installs Playwright browsers automatically

## 🚀 Quick Start

### Installation

```bash
cd plugins/browser-automation
npm install
npm run build
```

The post-install script will automatically:
- Install Playwright browsers (Chromium)
- Create default config at `.claude/.smite/browser.json`

### Usage

#### Command Line

```bash
# Navigate to URL
npx tsx src/cli.ts goto https://google.com

# Search on Google
npx tsx src/cli.ts search "Browser MCP"

# Search on YouTube
npx tsx src/cli.ts search "cats" youtube

# Take screenshot
npx tsx src/cli.ts screenshot results.png https://google.com

# Extract content
npx tsx src/cli.ts extract https://example.com "h1"

# Interactive mode (keep browser open)
npx tsx src/cli.ts interactive https://google.com
```

#### Programmatic API

```typescript
import { initBrowser, goto, search, screenshot, closeBrowser } from '@smite/browser-automation';

// Initialize browser
await initBrowser({ headless: false });

// Navigate
await goto('https://google.com');

// Search
await search('Browser MCP');

// Take screenshot
const path = await screenshot('results.png');

// Close browser
await closeBrowser();
```

## ⚙️ Configuration

Create `.claude/.smite/browser.json`:

```json
{
  "browser": "chromium",
  "headless": false,
  "viewport": {
    "width": 1280,
    "height": 720
  },
  "timeout": 30000,
  "screenshots": {
    "dir": ".smite/screenshots",
    "format": "png"
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `browser` | string | `"chromium"` | Browser to use (chromium/firefox/webkit) |
| `headless` | boolean | `false` | Run without UI |
| `viewport` | object | `{width: 1280, height: 720}` | Page viewport size |
| `timeout` | number | `30000` | Default timeout in ms |
| `screenshots.dir` | string | `".smite/screenshots"` | Screenshot output directory |
| `screenshots.format` | string | `"png"` | Screenshot format (png/jpeg) |

## 📖 API Reference

### `initBrowser(config?)`

Initialize browser with optional config.

```typescript
await initBrowser({
  headless: false,
  viewport: { width: 1920, height: 1080 }
});
```

### `goto(url)`

Navigate to URL.

```typescript
await goto('https://google.com');
```

### `search(query, engine?)`

Search using specified engine.

```typescript
await search('Browser MCP', 'google'); // or 'youtube', 'bing'
```

### `screenshot(filename?)`

Take screenshot of current page.

```typescript
const path = await screenshot('my-page.png');
```

### `extract(selector)`

Extract text from elements.

```typescript
const texts = await extract('h1, h2, h3');
```

### `click(selector)`

Click on element.

```typescript
await click('button[type="submit"]');
```

### `fill(selector, value)`

Fill input field.

```typescript
await fill('input[name="email"]', 'user@example.com');
```

### `closeBrowser()`

Close browser and cleanup resources.

```typescript
await closeBrowser();
```

## 🎯 Use Cases

### Web Scraping

```typescript
await goto('https://example.com/products');
const products = await extract('.product-title');
console.log(products);
```

### Automated Testing

```typescript
await goto('https://myapp.com/login');
await fill('#email', 'test@example.com');
await fill('#password', 'secret');
await click('button[type="submit"]');
await screenshot('login-success.png');
```

### Search & Research

```typescript
await search('AI automation tools 2025');
const links = await extract('#search a');
console.log(`Found ${links.length} results`);
```

### Content Monitoring

```typescript
await goto('https://price-tracker.com/product/123');
const price = await extract('.price')[0];
console.log(`Current price: ${price}`);
```

## 🔧 Advanced Usage

### Custom Browser Manager

```typescript
import { PlaywrightManager } from '@smite/browser-automation';

const manager = new PlaywrightManager({
  headless: true,
  viewport: { width: 1920, height: 1080 }
});

await manager.initialize();
await manager.goto('https://example.com');

const page = manager.getPage();
const title = await page.title();

await manager.close();
```

### Multiple Pages

```typescript
const manager = new PlaywrightManager();
await manager.initialize();

const page1 = await manager.context.newPage();
const page2 = await manager.context.newPage();

await page1.goto('https://google.com');
await page2.goto('https://bing.com');

// ... work with both pages

await manager.close();
```

## 🐛 Troubleshooting

### Playwright Not Found

```bash
npm install
npx playwright install chromium
```

### Browser Launch Failed

Make sure system dependencies are installed:

**Ubuntu/Debian:**
```bash
npx playwright install-deps chromium
```

**Windows:**
Usually works out of the box.

**macOS:**
```bash
npx playwright install-deps chromium
```

### Timeout Errors

Increase timeout in config:

```json
{
  "timeout": 60000
}
```

## 📚 Documentation

- [INSTALL.md](./INSTALL.md) - Detailed installation guide
- [MARKETPLACE.md](./MARKETPLACE.md) - Marketplace listing

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md).

## 📄 License

MIT © Pamacea

## 🙏 Acknowledgments

Built with [Playwright](https://playwright.dev/)
Part of [SMITE](https://github.com/pamacea/smite) ecosystem

---

**Made with ❤️ by the SMITE team**
