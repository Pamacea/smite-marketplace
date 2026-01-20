/**
 * Vision Feature Usage Examples
 *
 * This file demonstrates how to use the Vision Feature module
 * for various image analysis and UI understanding tasks.
 */

import {
  VisionFeature,
  analyzeImage,
  extractText,
  analyzeUI,
  diagnoseError,
  compareUI,
  type ImageSource,
  type Result,
} from '../src/features/index.js';

// ============================================================================
// Example 1: General Image Analysis
// ============================================================================

async function example1_AnalyzeScreenshot() {
  console.log('=== Example 1: Analyzing Screenshot ===\n');

  const vision = new VisionFeature();

  const result = await vision.analyzeImage(
    './examples/assets/dashboard-screenshot.png',
    'Describe the layout structure, main components, color scheme, and design patterns used in this UI'
  );

  if (result.success) {
    console.log('AI Analysis:');
    console.log(result.data);
    console.log('\n✅ Analysis complete\n');
  } else {
    console.error('❌ Analysis failed:', result.error.message);
  }
}

// ============================================================================
// Example 2: Extract Text from Code Screenshot
// ============================================================================

async function example2_ExtractCode() {
  console.log('=== Example 2: Extracting Code ===\n');

  const vision = new VisionFeature();

  const result = await vision.extractText('./examples/assets/code-screenshot.png', {
    programmingLanguage: 'typescript',
    prompt: 'Extract the complete TypeScript code with proper syntax and formatting',
  });

  if (result.success) {
    console.log('Extracted Code:');
    console.log(result.data.text);
    console.log('\n✅ Code extraction complete\n');
  } else {
    console.error('❌ Extraction failed:', result.error.message);
  }
}

// ============================================================================
// Example 3: Generate React Code from Design
// ============================================================================

async function example3_GenerateComponent() {
  console.log('=== Example 3: Generating React Component ===\n');

  const vision = new VisionFeature();

  const result = await vision.analyzeUI(
    './examples/assets/button-design.png',
    'code',
    'Generate a React component with TypeScript and Tailwind CSS. Include proper TypeScript interfaces and component documentation.'
  );

  if (result.success) {
    console.log('Generated Component Code:');
    console.log(result.data);
    console.log('\n✅ Component generation complete\n');

    // Could write to file:
    // await fs.writeFile('./Button.tsx', result.data);
  } else {
    console.error('❌ Generation failed:', result.error.message);
  }
}

// ============================================================================
// Example 4: Generate Design Specification
// ============================================================================

async function example4_ExtractDesignSpec() {
  console.log('=== Example 4: Extracting Design Specification ===\n');

  const vision = new VisionFeature();

  const result = await vision.analyzeUI('./examples/assets/card-design.png', 'spec');

  if (result.success) {
    console.log('Design Specification:');
    console.log(result.data);
    console.log('\n✅ Specification extraction complete\n');
  } else {
    console.error('❌ Extraction failed:', result.error.message);
  }
}

// ============================================================================
// Example 5: Diagnose Build Error
// ============================================================================

async function example5_DiagnoseError() {
  console.log('=== Example 5: Diagnosing Build Error ===\n');

  const vision = new VisionFeature();

  const result = await vision.diagnoseError(
    './examples/assets/build-error.png',
    'Running `npm run build` in Next.js project with TypeScript'
  );

  if (result.success) {
    console.log(`❌ Error Type: ${result.data.errorType}`);
    console.log(`Error Message: ${result.data.errorMessage}\n`);

    console.log('🔍 Possible Causes:');
    result.data.possibleCauses.forEach((cause, i) => {
      console.log(`  ${i + 1}. ${cause}`);
    });

    console.log('\n💡 Suggested Fixes:');
    result.data.suggestedFixes.forEach((fix, i) => {
      console.log(`  ${i + 1}. ${fix}`);
    });

    console.log('\n✅ Error diagnosis complete\n');
  } else {
    console.error('❌ Diagnosis failed:', result.error.message);
  }
}

// ============================================================================
// Example 6: Visual Regression Testing
// ============================================================================

async function example6_VisualRegression() {
  console.log('=== Example 6: Visual Regression Testing ===\n');

  const vision = new VisionFeature();

  const result = await vision.compareUI(
    './examples/assets/expected-design.png',
    './examples/assets/actual-implementation.png',
    'Focus on layout, spacing, typography, and color accuracy'
  );

  if (result.success) {
    console.log(`Similarity Score: ${result.data.similarityScore}%\n`);

    if (result.data.hasDifferences) {
      console.log(`⚠️ Found ${result.data.differences.length} differences:\n`);

      result.data.differences.forEach((diff, i) => {
        const icon = diff.severity === 'high' ? '🔴' : diff.severity === 'medium' ? '🟡' : '🟢';
        console.log(`${icon} Difference ${i + 1}:`);
        console.log(`   Type: ${diff.type}`);
        console.log(`   Location: ${diff.location}`);
        console.log(`   Description: ${diff.description}`);
        console.log('');
      });
    } else {
      console.log('✅ No visual differences detected! Perfect match.\n');
    }
  } else {
    console.error('❌ Comparison failed:', result.error.message);
  }
}

// ============================================================================
// Example 7: Analyze Data Visualization
// ============================================================================

async function example7_AnalyzeChart() {
  console.log('=== Example 7: Analyzing Data Visualization ===\n');

  const vision = new VisionFeature();

  const result = await vision.analyzeDataViz(
    './examples/assets/revenue-chart.png',
    'What are the key trends, patterns, outliers, and insights? Provide specific data points.',
    'trends'
  );

  if (result.success) {
    console.log('Chart Analysis:');
    console.log(result.data);
    console.log('\n✅ Analysis complete\n');
  } else {
    console.error('❌ Analysis failed:', result.error.message);
  }
}

// ============================================================================
// Example 8: Understand Technical Diagram
// ============================================================================

async function example8_UnderstandArchitecture() {
  console.log('=== Example 8: Understanding Architecture Diagram ===\n');

  const vision = new VisionFeature();

  const result = await vision.understandDiagram(
    './examples/assets/system-architecture.png',
    'Explain the data flow, component interactions, and key architectural patterns',
    'architecture'
  );

  if (result.success) {
    console.log('Architecture Explanation:');
    console.log(result.data);
    console.log('\n✅ Analysis complete\n');
  } else {
    console.error('❌ Analysis failed:', result.error.message);
  }
}

// ============================================================================
// Example 9: Convenience Functions
// ============================================================================

async function example9_ConvenienceFunctions() {
  console.log('=== Example 9: Using Convenience Functions ===\n');

  // Using standalone functions instead of creating a class instance
  const analysis = await analyzeImage(
    './examples/assets/screenshot.png',
    'Quick analysis of this UI'
  );

  if (analysis.success) {
    console.log('Quick Analysis:', analysis.data);
  }

  const text = await extractText('./examples/assets/text.png');
  if (text.success) {
    console.log('Extracted Text:', text.data.text);
  }

  const code = await analyzeUI('./examples/assets/ui.png', 'code');
  if (code.success) {
    console.log('Generated Code available');
  }

  console.log('\n✅ Convenience functions work\n');
}

// ============================================================================
// Example 10: Real-World Workflow - Debug Visual Regression
// ============================================================================

async function example10_DebugWorkflow() {
  console.log('=== Example 10: Debug Workflow ===\n');

  const vision = new VisionFeature();

  async function debugVisualRegression(
    designPath: string,
    implPath: string
  ): Promise<void> {
    console.log(`Comparing: ${designPath} vs ${implPath}\n`);

    const comparison = await vision.compareUI(
      designPath,
      implPath,
      'Focus on layout accuracy, spacing, typography, and visual fidelity'
    );

    if (!comparison.success) {
      console.error('Comparison failed:', comparison.error);
      return;
    }

    if (comparison.data.hasDifferences) {
      const criticalIssues = comparison.data.differences.filter(
        (d) => d.severity === 'high'
      );

      if (criticalIssues.length > 0) {
        console.log(`🔴 Found ${criticalIssues.length} CRITICAL issues:\n`);

        for (const issue of criticalIssues) {
          console.log(`Issue: ${issue.description}`);
          console.log(`Location: ${issue.location}`);
          console.log(`Type: ${issue.type}\n`);

          // Suggest fix
          if (issue.type === 'layout') {
            console.log('💡 Suggestion: Check CSS grid/flexbox properties\n');
          } else if (issue.type === 'style') {
            console.log('💡 Suggestion: Verify color values and styling\n');
          }
        }
      }

      const nonCritical = comparison.data.differences.filter(
        (d) => d.severity !== 'high'
      );

      if (nonCritical.length > 0) {
        console.log(`🟡 ${nonCritical.length} minor differences found\n`);
      }
    } else {
      console.log('✅ Perfect match! No visual differences detected.\n');
    }
  }

  await debugVisualRegression(
    './examples/assets/expected-login.png',
    './examples/assets/actual-login.png'
  );
}

// ============================================================================
// Example 11: Real-World Workflow - Component Generation Pipeline
// ============================================================================

async function example11_ComponentPipeline() {
  console.log('=== Example 11: Component Generation Pipeline ===\n');

  const vision = new VisionFeature();

  async function generateComponentFromDesign(
    designPath: string,
    componentName: string
  ): Promise<string | null> {
    console.log(`Generating ${componentName} from design...\n`);

    // Step 1: Extract design specification
    console.log('Step 1: Extracting design specification...');
    const specResult = await vision.analyzeUI(designPath, 'spec');

    if (!specResult.success) {
      console.error('❌ Failed to extract spec');
      return null;
    }
    console.log('✅ Design spec extracted\n');

    // Step 2: Generate React code
    console.log('Step 2: Generating React component...');
    const codeResult = await vision.analyzeUI(
      designPath,
      'code',
      `Generate a modern React component with TypeScript and Tailwind CSS for ${componentName}. Include:
- Proper TypeScript interfaces for props
- JSDoc comments
- Responsive design
- Accessibility attributes
- Clean, maintainable code structure`
    );

    if (!codeResult.success) {
      console.error('❌ Failed to generate code');
      return null;
    }

    console.log('✅ Component code generated\n');
    return codeResult.data;
  }

  const code = await generateComponentFromDesign(
    './examples/assets/button-design.png',
    'PrimaryButton'
  );

  if (code) {
    console.log('Generated Component:');
    console.log('---');
    console.log(code);
    console.log('---');
    console.log('\n✅ Pipeline complete\n');
  }
}

// ============================================================================
// Example 12: Batch Processing
// ============================================================================

async function example12_BatchProcessing() {
  console.log('=== Example 12: Batch Processing Screenshots ===\n');

  const vision = new VisionFeature();

  const screenshots: ImageSource[] = [
    './examples/assets/screen1.png',
    './examples/assets/screen2.png',
    './examples/assets/screen3.png',
  ];

  console.log(`Processing ${screenshots.length} screenshots...\n`);

  const results = await Promise.all(
    screenshots.map(async (screenshot, index) => {
      const result = await vision.analyzeImage(
        screenshot,
        'Describe the main components and purpose of this screen'
      );

      return {
        screenshot,
        index: index + 1,
        success: result.success,
        data: result.success ? result.data : null,
        error: result.success ? null : result.error?.message,
      };
    })
  );

  console.log('Batch Processing Results:\n');

  results.forEach((result) => {
    if (result.success) {
      console.log(`✅ Screenshot ${result.index}:`);
      console.log(`   ${result.data?.substring(0, 100)}...\n`);
    } else {
      console.log(`❌ Screenshot ${result.index}:`);
      console.log(`   Error: ${result.error}\n`);
    }
  });

  console.log('✅ Batch processing complete\n');
}

// ============================================================================
// Run All Examples
// ============================================================================

async function runExamples() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     Vision Feature Usage Examples                          ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Uncomment the examples you want to run:

  // await example1_AnalyzeScreenshot();
  // await example2_ExtractCode();
  // await example3_GenerateComponent();
  // await example4_ExtractDesignSpec();
  // await example5_DiagnoseError();
  // await example6_VisualRegression();
  // await example7_AnalyzeChart();
  // await example8_UnderstandArchitecture();
  // await example9_ConvenienceFunctions();
  // await example10_DebugWorkflow();
  // await example11_ComponentPipeline();
  // await example12_BatchProcessing();

  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     All Examples Complete                                  ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
}

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runExamples().catch(console.error);
}

export {
  example1_AnalyzeScreenshot,
  example2_ExtractCode,
  example3_GenerateComponent,
  example4_ExtractDesignSpec,
  example5_DiagnoseError,
  example6_VisualRegression,
  example7_AnalyzeChart,
  example8_UnderstandArchitecture,
  example9_ConvenienceFunctions,
  example10_DebugWorkflow,
  example11_ComponentPipeline,
  example12_BatchProcessing,
};
