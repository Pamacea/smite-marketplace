/**
 * Read Feature - Simple Usage Examples
 *
 * This file demonstrates basic usage of the read feature module.
 * These examples can be adapted for actual use.
 */

import { ReadFeature, readWebPage, batchRead } from '../src/features/read.feature.js';

// Example 1: Read a single web page
async function example1_ReadSinglePage() {
  const feature = new ReadFeature();
  const result = await feature.readWebPage('https://example.com');

  if (result.success) {
    console.log('Page content:', result.data);
  } else {
    console.error('Error:', result.error.message);
  }
}

// Example 2: Read with options
async function example2_ReadWithOptions() {
  const result = await readWebPage('https://example.com', {
    returnFormat: 'markdown',
    retainImages: true,
    withImagesSummary: true,
    withLinksSummary: true,
    useCache: false,
  });

  if (result.success) {
    console.log('Markdown content:', result.data);
  }
}

// Example 3: Batch read multiple URLs
async function example3_BatchRead() {
  const urls = [
    'https://example.com/page1',
    'https://example.com/page2',
    'https://example.com/page3',
  ];

  const results = await batchRead(urls, {
    returnFormat: 'markdown',
  });

  console.log(`Success rate: ${(results.successRate * 100).toFixed(1)}%`);
  console.log(`Time: ${results.totalTime}ms`);

  // Access successful reads
  for (const [url, content] of results.contents) {
    console.log(`${url}: ${content.length} chars`);
  }

  // Handle errors
  for (const [url, error] of results.errors) {
    console.error(`${url}: ${error.message}`);
  }
}

// Example 4: Read with metadata
async function example4_ReadWithMetadata() {
  const feature = new ReadFeature();
  const result = await feature.readWebPageWithMetadata('https://example.com');

  if (result.success) {
    const { content, images, links } = result.data;
    console.log('Content length:', content.length);
    console.log('Images:', images?.length || 0);
    console.log('Links:', links?.length || 0);
  }
}

// Example 5: Extract structured data
async function example5_ExtractStructuredData() {
  const feature = new ReadFeature();

  const schema = {
    fields: {
      title: { pattern: /^#\s+(.*)$/m },
      links: { pattern: /\[.*?\]\((.*?)\)/g, multiple: true },
    },
  };

  const result = await feature.extractStructuredData(
    'https://example.com',
    schema
  );

  if (result.success) {
    console.log('Extracted:', result.data);
  }
}

// Example 6: Content analysis
async function example6_ContentAnalysis() {
  const feature = new ReadFeature();
  const result = await feature.readWebPage('https://example.com');

  if (result.success) {
    const summary = feature.summarizeContent(result.data);
    console.log('Summary:', summary);

    // Extract images
    const images = feature.extractImages(result.data);
    console.log('Images:', images);

    // Extract links
    const links = feature.extractLinks(result.data);
    console.log('Links:', links);
  }
}

// Export examples for use
export {
  example1_ReadSinglePage,
  example2_ReadWithOptions,
  example3_BatchRead,
  example4_ReadWithMetadata,
  example5_ExtractStructuredData,
  example6_ContentAnalysis,
};
