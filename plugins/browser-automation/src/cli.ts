#!/usr/bin/env node

import { PlaywrightManager } from './playwright-manager.js';

interface Command {
  action: string;
  args: string[];
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printUsage();
    process.exit(1);
  }

  const action = args[0];
  const actionArgs = args.slice(1);

  const manager = new PlaywrightManager();

  try {
    switch (action) {
      case 'goto':
        if (actionArgs.length === 0) {
          console.error('❌ Error: goto requires a URL');
          console.log('Usage: browse goto <url>');
          process.exit(1);
        }
        await manager.initialize();
        await manager.goto(actionArgs[0]);
        await manager.close();
        break;

      case 'search':
        if (actionArgs.length === 0) {
          console.error('❌ Error: search requires a query');
          console.log('Usage: browse search <query> [google|youtube|bing]');
          process.exit(1);
        }
        const searchEngine = (actionArgs[1] || 'google') as 'google' | 'youtube' | 'bing';
        await manager.initialize();
        await manager.search(actionArgs[0], searchEngine);
        const screenshotPath = await manager.screenshot(`search-${Date.now()}.png`);
        console.log(`\n🎯 Results saved to: ${screenshotPath}`);
        await manager.close();
        break;

      case 'screenshot':
        await manager.initialize();
        const filename = actionArgs[0] || `screenshot-${Date.now()}.png`;
        await manager.goto(actionArgs[1] || 'https://www.google.com');
        const path = await manager.screenshot(filename);
        console.log(`\n📸 Screenshot saved: ${path}`);
        await manager.close();
        break;

      case 'extract':
        if (actionArgs.length < 2) {
          console.error('❌ Error: extract requires URL and selector');
          console.log('Usage: browse extract <url> <selector>');
          process.exit(1);
        }
        await manager.initialize();
        await manager.goto(actionArgs[0]);
        const results = await manager.extract(actionArgs[1]);
        console.log('\n📝 Extracted content:');
        results.forEach((text, i) => {
          console.log(`${i + 1}. ${text}`);
        });
        await manager.close();
        break;

      case 'interactive':
        console.log('🎭 Interactive mode - Browser will stay open');
        console.log('Press Ctrl+C to close\n');
        await manager.initialize();
        if (actionArgs[0]) {
          await manager.goto(actionArgs[0]);
        }
        console.log('✅ Browser ready! You can now interact with it manually.');
        console.log('Press Ctrl+C when done...\n');

        // Keep process alive
        process.on('SIGINT', async () => {
          console.log('\n🔚 Closing browser...');
          await manager.close();
          process.exit(0);
        });

        // Keep the script running
        await new Promise(() => {});
        break;

      default:
        console.error(`❌ Unknown action: ${action}`);
        printUsage();
        process.exit(1);
    }

    console.log('\n✅ Done!');
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error);
    await manager.close();
    process.exit(1);
  }
}

function printUsage() {
  console.log(`
🌐 SMITE Browser Automation

Usage: browse <action> [args...]

Actions:
  goto <url>                  Navigate to URL
  search <query> [engine]      Search on Google (default), YouTube, or Bing
  screenshot [file] [url]      Take screenshot (optional: URL)
  extract <url> <selector>     Extract text from elements
  interactive [url]            Open browser for manual interaction

Examples:
  browse goto https://google.com
  browse search "Browser MCP"
  browse search "cats" youtube
  browse screenshot google.png https://google.com
  browse extract https://example.com "h1"
  browse interactive https://google.com

For more info: https://github.com/pamacea/smite/tree/main/plugins/browser-automation
`);
}

main();
