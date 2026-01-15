import { Page, BrowserContext } from '@playwright/test';

export interface CustomWorld {
    page?: Page;
    context?: BrowserContext;
    testData?: Record<string, any>;
    scenarioData?: Record<string, any>;
}

export class CustomWorldImpl implements CustomWorld {
    public page?: Page;
    public context?: BrowserContext;
    public testData: Record<string, any> = {};
    public scenarioData: Record<string, any> = {};

    constructor() {
        // Initialize with empty data
    }

    // Utility methods for data management
    setTestData(key: string, value: any): void {
        this.testData[key] = value;
    }

    getTestData(key: string): any {
        return this.testData[key];
    }

    setScenarioData(key: string, value: any): void {
        this.scenarioData[key] = value;
    }

    getScenarioData(key: string): any {
        return this.scenarioData[key];
    }

    clearScenarioData(): void {
        this.scenarioData = {};
    }

    // Utility methods for common test operations
    async waitForPageLoad(): Promise<void> {
        if (this.page) {
            await this.page.waitForLoadState('networkidle');
        }
    }

    async getCurrentUrl(): Promise<string> {
        return this.page?.url() || '';
    }

    async getPageTitle(): Promise<string> {
        return this.page?.title() || '';
    }

    async takeScreenshot(name?: string): Promise<Buffer | undefined> {
        if (this.page) {
            const screenshotName = name || `screenshot-${Date.now()}`;
            return await this.page.screenshot({
                path: `./test-results/screenshots/${screenshotName}.png`,
                fullPage: true
            });
        }
        return undefined;
    }

    // Log helper methods
    logInfo(message: string): void {
        console.log(`ℹ️  INFO: ${message}`);
    }

    logError(message: string): void {
        console.log(`❌ ERROR: ${message}`);
    }

    logWarning(message: string): void {
        console.log(`⚠️  WARNING: ${message}`);
    }

    logSuccess(message: string): void {
        console.log(`✅ SUCCESS: ${message}`);
    }
}

// Export the world implementation for use in tests
export { CustomWorldImpl as World };
