import { PlaywrightManager, BrowserConfig } from './playwright-manager.js';

// Re-export for convenience
export { PlaywrightManager, BrowserConfig } from './playwright-manager.js';

// Convenience functions for quick usage
let defaultManager: PlaywrightManager | null = null;

export async function initBrowser(config?: BrowserConfig) {
  defaultManager = new PlaywrightManager(config);
  await defaultManager.initialize();
  return defaultManager;
}

export async function goto(url: string) {
  if (!defaultManager) {
    defaultManager = new PlaywrightManager();
    await defaultManager.initialize();
  }
  return defaultManager.goto(url);
}

export async function search(query: string, searchEngine?: 'google' | 'youtube' | 'bing') {
  if (!defaultManager) {
    defaultManager = new PlaywrightManager();
    await defaultManager.initialize();
  }
  return defaultManager.search(query, searchEngine);
}

export async function screenshot(filename?: string) {
  if (!defaultManager) {
    throw new Error('Browser not initialized. Call initBrowser() or goto() first.');
  }
  return defaultManager.screenshot(filename);
}

export async function extract(selector: string) {
  if (!defaultManager) {
    throw new Error('Browser not initialized. Call initBrowser() or goto() first.');
  }
  return defaultManager.extract(selector);
}

export async function click(selector: string) {
  if (!defaultManager) {
    throw new Error('Browser not initialized. Call initBrowser() or goto() first.');
  }
  return defaultManager.click(selector);
}

export async function fill(selector: string, value: string) {
  if (!defaultManager) {
    throw new Error('Browser not initialized. Call initBrowser() or goto() first.');
  }
  return defaultManager.fill(selector, value);
}

export async function closeBrowser() {
  if (defaultManager) {
    await defaultManager.close();
    defaultManager = null;
  }
}
