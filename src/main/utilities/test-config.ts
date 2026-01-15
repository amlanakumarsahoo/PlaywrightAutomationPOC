export interface TestConfig {
    browser: 'chromium' | 'firefox' | 'webkit';
    headless: boolean;
    slowMo: number;
    timeout: number;
    viewport: {
        width: number;
        height: number;
    };
    baseUrl: string;
    recordVideo: boolean;
    takeScreenshotOnFailure: boolean;
    retryCount: number;
}

export const defaultTestConfig: TestConfig = {
    browser: (process.env.BROWSER as 'chromium' | 'firefox' | 'webkit') || 'chromium',
    headless: process.env.HEADLESS === 'true',
    slowMo: parseInt(process.env.SLOW_MO || '50'),
    timeout: parseInt(process.env.TIMEOUT || '30000'),
    viewport: {
        width: parseInt(process.env.VIEWPORT_WIDTH || '1920'),
        height: parseInt(process.env.VIEWPORT_HEIGHT || '1080')
    },
    baseUrl: process.env.BASE_URL || 'http://automationexercise.com',
    recordVideo: process.env.RECORD_VIDEO === 'true',
    takeScreenshotOnFailure: process.env.SCREENSHOT_ON_FAILURE !== 'false',
    retryCount: parseInt(process.env.RETRY_COUNT || '3')
};

export const testDirectories = {
    screenshots: './test-results/screenshots/',
    videos: './test-results/videos/',
    reports: './test-results/reports/',
    downloads: './test-results/downloads/'
};

// Environment-specific configurations
export const environments = {
    dev: {
        ...defaultTestConfig,
        baseUrl: 'http://automationexercise.com',
        timeout: 45000
    },
    staging: {
        ...defaultTestConfig,
        baseUrl: 'http://staging.automationexercise.com',
        timeout: 60000
    },
    prod: {
        ...defaultTestConfig,
        baseUrl: 'http://automationexercise.com',
        timeout: 30000,
        headless: true
    }
};

export function getTestConfig(): TestConfig {
    const env = process.env.TEST_ENV || 'dev';
    return environments[env as keyof typeof environments] || defaultTestConfig;
}
