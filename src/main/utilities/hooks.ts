import { Browser, BrowserContext, Page, chromium, firefox, webkit, test } from '@playwright/test';
import { getHerokuAppUrl } from './autoExe-utils';
import { getTestConfig } from './test-config';

// Global variables for browser management
let globalBrowser: Browser | null = null;
let consoleLogs: any[] = [];
let networkLogs: any[] = [];

/**
 * Browser setup utilities for Playwright BDD tests
 */
export class BrowserManager {
    private static browser: Browser | null = null;
    private static context: BrowserContext | null = null;
    private static page: Page | null = null;

    /**
     * Initialize browser based on configuration
     */
    static async initializeBrowser(): Promise<Browser> {
        if (this.browser) {
            return this.browser;
        }

        console.log('🚀 Starting browser setup...');
        const config = getTestConfig();
        
        switch (config.browser) {
            case 'firefox':
                this.browser = await firefox.launch({
                    headless: config.headless,
                    slowMo: config.slowMo
                });
                break;
            case 'webkit':
                this.browser = await webkit.launch({
                    headless: config.headless,
                    slowMo: config.slowMo
                });
                break;
            default:
                this.browser = await chromium.launch({
                    headless: config.headless,
                    slowMo: config.slowMo,
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                });
        }
        
        console.log(`✅ Browser ${config.browser} launched successfully`);
        globalBrowser = this.browser;
        return this.browser;
    }

    /**
     * Create new browser context for test isolation
     */
    static async createContext(): Promise<BrowserContext> {
        if (!this.browser) {
            await this.initializeBrowser();
        }

        const config = getTestConfig();
        this.context = await this.browser!.newContext({
            viewport: config.viewport,
            ignoreHTTPSErrors: true,
            acceptDownloads: true,
            recordVideo: config.recordVideo ? {
                dir: './test-results/videos/',
                size: config.viewport
            } : undefined
        });

        return this.context;
    }

    /**
     * Create new page with error handling
     */
    static async createPage(): Promise<Page> {
        if (!this.context) {
            await this.createContext();
        }

        this.page = await this.context!.newPage();
        const config = getTestConfig();
        
        // Set default timeout
        this.page.setDefaultTimeout(config.timeout);
        
        // Add console logging for debugging and Allure reporting
        this.page.on('console', msg => {
            const logEntry = {
                type: msg.type(),
                text: msg.text(),
                timestamp: new Date().toISOString(),
                url: this.page?.url() || 'unknown'
            };
            consoleLogs.push(logEntry);
            
            if (msg.type() === 'error') {
                console.log(`❌ Browser Console Error: ${msg.text()}`);
            }
        });
        
        // Add page error handling
        this.page.on('pageerror', error => {
            const errorEntry = {
                type: 'pageerror',
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString(),
                url: this.page?.url() || 'unknown'
            };
            consoleLogs.push(errorEntry);
            console.log(`❌ Page Error: ${error.message}`);
        });
        
        // Add network request/response logging
        this.page.on('request', request => {
            const networkEntry = {
                type: 'request',
                method: request.method(),
                url: request.url(),
                headers: request.headers(),
                timestamp: new Date().toISOString()
            };
            networkLogs.push(networkEntry);
        });
        
        this.page.on('response', response => {
            const networkEntry = {
                type: 'response',
                status: response.status(),
                statusText: response.statusText(),
                url: response.url(),
                headers: response.headers(),
                timestamp: new Date().toISOString()
            };
            networkLogs.push(networkEntry);
        });

        return this.page;
    }

    /**
     * Navigate to base URL
     */
    static async navigateToBaseUrl(): Promise<void> {
        if (!this.page) {
            await this.createPage();
        }

        const baseUrl = getHerokuAppUrl();
        await this.page!.goto(baseUrl, { waitUntil: 'networkidle' });
        console.log(`🌐 Navigated to: ${baseUrl}`);
    }

    /**
     * Take screenshot for debugging
     */
    static async takeScreenshot(name: string): Promise<Buffer | undefined> {
        if (!this.page) {
            return undefined;
        }

        return await this.page.screenshot({
            path: `./test-results/screenshots/${name}-${Date.now()}.png`,
            fullPage: true
        });
    }

    /**
     * Clean up context
     */
    static async closeContext(): Promise<void> {
        if (this.context) {
            await this.context.close();
            this.context = null;
            this.page = null;
            // Clear logs for next test
            consoleLogs = [];
            networkLogs = [];
            console.log('🧹 Context closed and cleaned up');
        }
    }

    /**
     * Close browser
     */
    static async closeBrowser(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            globalBrowser = null;
            console.log('✅ Browser closed successfully');
        }
    }

    /**
     * Get current page instance
     */
    static getCurrentPage(): Page | null {
        return this.page;
    }

    /**
     * Get current context instance
     */
    static getCurrentContext(): BrowserContext | null {
        return this.context;
    }
    
    /**
     * Get console logs for current test session
     */
    static getConsoleLogs(): any[] {
        return [...consoleLogs];
    }
    
    /**
     * Get network logs for current test session
     */
    static getNetworkLogs(): any[] {
        return [...networkLogs];
    }
    
    /**
     * Clear all logs
     */
    static clearLogs(): void {
        consoleLogs = [];
        networkLogs = [];
    }
}

// Export utility functions that use BrowserManager
export function getCurrentPage(): Page | null {
    return BrowserManager.getCurrentPage();
}

export function getCurrentContext(): BrowserContext | null {
    return BrowserManager.getCurrentContext();
}

// Utility function for waiting
export async function waitForElement(selector: string, timeout: number = 10000): Promise<void> {
    const page = BrowserManager.getCurrentPage();
    if (page) {
        await page.waitForSelector(selector, { timeout });
    }
}

// Utility function for taking screenshots
export async function takeScreenshot(name: string): Promise<void> {
    await BrowserManager.takeScreenshot(name);
}

// Utility function for page navigation with retry
export async function navigateToUrl(url: string, retries: number = 3): Promise<void> {
    const page = BrowserManager.getCurrentPage();
    if (!page) {
        throw new Error('No page available for navigation');
    }

    for (let i = 0; i < retries; i++) {
        try {
            await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
            return;
        } catch (error) {
            console.log(`❌ Navigation attempt ${i + 1} failed: ${error}`);
            if (i === retries - 1) throw error;
            await page.waitForTimeout(2000);
        }
    }
}

// Utility function for clearing browser data
export async function clearBrowserData(): Promise<void> {
    const context = BrowserManager.getCurrentContext();
    if (context) {
        await context.clearCookies();
        await context.clearPermissions();
        console.log('🧹 Browser data cleared');
    }
}
