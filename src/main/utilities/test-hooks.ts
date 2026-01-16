import { test, Browser, BrowserContext, Page } from '@playwright/test';
import { BrowserManager } from './hooks';
import { getTestConfig } from './test-config';
import { CucumberReportGenerator } from './cucumber-report-generator';

// Define test status enum for compatibility
enum TestStatus {
  PASSED = 'passed',
  FAILED = 'failed',
  SKIPPED = 'skipped',
  UNKNOWN = 'unknown'
}

// Global test context
interface TestContext {
  browser: Browser | null;
  context: BrowserContext | null;
  page: Page | null;
  testStartTime: number;
  scenarioName: string;
}

let testContext: TestContext = {
  browser: null,
  context: null,
  page: null,
  testStartTime: 0,
  scenarioName: ''
};

/**
 * Global setup - runs once before all tests
 * Note: In playwright-bdd, global setup is handled via playwright.config.ts
 * This function can be called manually if needed
 */
export async function globalSetup() {
  console.log('🚀 Starting test suite setup...');
  
  const config = getTestConfig();
  console.log(`📋 Test Configuration:`);
  console.log(`   - Browser: ${config.browser}`);
  console.log(`   - Headless: ${config.headless}`);
  console.log(`   - Base URL: ${config.baseUrl || 'Not specified'}`);
  console.log(`   - Viewport: ${config.viewport.width}x${config.viewport.height}`);
  
  console.log('✅ Global test setup completed');
}

/**
 * Global teardown - runs once after all tests
 * Note: In playwright-bdd, global teardown is handled via playwright.config.ts
 * This function can be called manually if needed
 */
export async function globalTeardown() {
  console.log('🧹 Starting global cleanup...');
  
  // Ensure all browser resources are cleaned up
  if (testContext.browser) {
    await testContext.browser.close();
    testContext.browser = null;
  }
  
  // Generate Cucumber HTML report
  console.log('📊 Generating Cucumber HTML report...');
  try {
    await CucumberReportGenerator.generateReport();
    console.log('✅ Cucumber HTML report generated successfully!');
  } catch (error) {
    console.error('❌ Failed to generate Cucumber HTML report:', error);
  }
  
  console.log('✅ Global cleanup completed');
}

/**
 * Before each scenario - runs before every test scenario
 * This function should be called from your step definition files
 */
export async function beforeScenario(scenarioInfo: { name: string; tags?: string[]; uri?: string }) {
  testContext.testStartTime = Date.now();
  testContext.scenarioName = scenarioInfo.name;
  
  console.log(`🎬 Starting scenario: "${testContext.scenarioName}"`);
  
  try {
    // Initialize browser for this scenario
    testContext.browser = await BrowserManager.initializeBrowser();
    testContext.context = await BrowserManager.createContext();
    testContext.page = await BrowserManager.createPage();
    
    // Log test metadata
    const config = getTestConfig();
    console.log(`📊 Test Metadata:`);
    console.log(`   - Feature: ${scenarioInfo.uri?.split('/').pop()?.replace('.feature', '') || 'Unknown Feature'}`);
    console.log(`   - Browser: ${config.browser}`);
    console.log(`   - Viewport: ${config.viewport.width}x${config.viewport.height}`);
    console.log(`   - Headless: ${config.headless}`);
    
    // Log scenario tags if present
    if (scenarioInfo.tags && scenarioInfo.tags.length > 0) {
      const tags = scenarioInfo.tags.join(', ');
      console.log(`   - Tags: ${tags}`);
    }
    
    // Navigate to base URL if configured
    await BrowserManager.navigateToBaseUrl();
    
    // Take initial screenshot for debugging
    await BrowserManager.takeScreenshot('scenario-start');
    console.log('📸 Initial screenshot captured');
    
    console.log(`✅ Scenario setup completed for: "${testContext.scenarioName}"`);
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    
    console.error(`❌ Failed to setup scenario: "${testContext.scenarioName}"`, {
      error: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString()
    });
    
    throw error;
  }
}

/**
 * After each scenario - runs after every test scenario
 * This function should be called from your step definition files
 */
export async function afterScenario(scenarioResult: { status: string; error?: Error }) {
  const testDuration = Date.now() - testContext.testStartTime;
  const status = scenarioResult.status || TestStatus.UNKNOWN;
  
  console.log(`🎭 Finishing scenario: "${testContext.scenarioName}" - Status: ${status} - Duration: ${testDuration}ms`);
  
  try {
    // Log test duration
    console.log(`⏱️  Test Duration: ${testDuration}ms`);
    
    // Handle different test outcomes
    if (status === TestStatus.FAILED) {
      await handleTestFailure(scenarioResult);
    } else if (status === TestStatus.PASSED) {
      await handleTestSuccess();
    }
    
    // Always take final screenshot
    await BrowserManager.takeScreenshot(`scenario-end-${status.toLowerCase()}`);
    console.log('📸 Final screenshot captured');
    
    // Log debugging information
    if (testContext.page) {
      const url = testContext.page.url();
      console.log(`🌐 Final URL: ${url}`);
      
      // Get and log console logs
      const consoleLogs = BrowserManager.getConsoleLogs();
      if (consoleLogs.length > 0) {
        console.log(`📝 Console logs captured: ${consoleLogs.length} entries`);
        // Log only errors and warnings to avoid spam
        const importantLogs = consoleLogs.filter(log => 
          log.type === 'error' || log.type === 'warning' || log.type === 'pageerror'
        );
        if (importantLogs.length > 0) {
          console.log('⚠️  Important console messages:', importantLogs);
        }
      }
      
      // Get and log network requests
      const networkLogs = BrowserManager.getNetworkLogs();
      if (networkLogs.length > 0) {
        console.log(`🌐 Network requests captured: ${networkLogs.length} entries`);
        // Log only failed requests
        const failedRequests = networkLogs.filter(log => 
          log.type === 'response' && log.status >= 400
        );
        if (failedRequests.length > 0) {
          console.log('❌ Failed network requests:', failedRequests);
        }
      }
    }
    
  } catch (cleanupError: unknown) {
    const errorMessage = cleanupError instanceof Error ? cleanupError.message : 'Unknown cleanup error';
    const errorStack = cleanupError instanceof Error ? cleanupError.stack : 'No stack trace';
    
    console.error(`❌ Error during scenario cleanup: "${testContext.scenarioName}"`, {
      error: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString()
    });
    
  } finally {
    // Always clean up browser resources
    await cleanupBrowserResources();
    
    console.log(`✅ Scenario cleanup completed for: "${testContext.scenarioName}"`);
  }
}

/**
 * Handle test failure scenarios
 */
async function handleTestFailure(scenarioResult: { status: string; error?: Error }): Promise<void> {
  console.log(`❌ Test failed: "${testContext.scenarioName}"`);
  
  // Take failure screenshot
  await BrowserManager.takeScreenshot('test-failure');
  console.log('📸 Failure screenshot captured');
  
  // Log failure details
  if (scenarioResult.error) {
    console.error('💥 Test Exception:', {
      message: scenarioResult.error.message,
      stack: scenarioResult.error.stack,
      timestamp: new Date().toISOString()
    });
  }
  
  // Log browser state at time of failure
  if (testContext.page) {
    const url = testContext.page.url();
    const title = await testContext.page.title().catch(() => 'Unable to get title');
    
    console.error('🌐 Browser State at Failure:', {
      url,
      title,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Handle test success scenarios
 */
async function handleTestSuccess(): Promise<void> {
  console.log(`✅ Test passed: "${testContext.scenarioName}"`);
  
  // Log success details
  if (testContext.page) {
    const url = testContext.page.url();
    const title = await testContext.page.title().catch(() => 'Unable to get title');
    
    console.log('🎉 Test Success Details:', {
      finalUrl: url,
      finalTitle: title,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Clean up browser resources
 */
async function cleanupBrowserResources(): Promise<void> {
  try {
    // Close context (this also closes the page)
    await BrowserManager.closeContext();
    
    // Close browser
    await BrowserManager.closeBrowser();
    
    // Reset test context
    testContext.context = null;
    testContext.page = null;
    testContext.browser = null;
    
  } catch (error) {
    console.error('❌ Error during browser cleanup:', error);
  }
}



/**
 * Export test context for use in step definitions
 */
export function getTestContext(): TestContext {
  return testContext;
}

/**
 * Export current page for step definitions
 */
export function getCurrentTestPage(): Page | null {
  return testContext.page;
}

/**
 * Export current context for step definitions
 */
export function getCurrentTestContext(): BrowserContext | null {
  return testContext.context;
}
