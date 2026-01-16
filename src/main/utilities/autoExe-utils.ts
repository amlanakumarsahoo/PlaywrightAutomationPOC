import { HomePageOperations } from "@src/main/operations/HomePageOperations";
import { HomePage } from "@src/main/web-implementation/HomePage";
import { Page } from "@playwright/test";
import { SignUpLoginPage } from "../web-implementation/SignUpLoginPage";
import { SignUpLoginPageOperations } from "../operations/SignUpLoginPageOperations";
import { getTestConfig } from "./test-config";
import { TestHelpers } from "./test-helpers";
import { ContactusOperations } from "../operations/ContactusOperations";
import { ContactUsPage } from "../web-implementation/ContactUsPage";
import { TestCasePage } from "../web-implementation/TestCasePage";
import { TestCasePageOperations } from "../operations/TestCasePageOperations";

export function getAutoExeUrl(): string {
    // Get URL from config or environment
    const config = getTestConfig();
    return config.baseUrl || process.env.BASE_URL || 'http://automationexercise.com';
}

export async function getAutoExeApp(page: Page): Promise<HomePageOperations> {
    return await HomePage.create(page);
}

export async function getSignUpLoginApp(page: Page): Promise<SignUpLoginPageOperations> {
    return await SignUpLoginPage.create(page);
}

export async function getContactUsApp(page: Page): Promise<ContactusOperations> {
    return await ContactUsPage.create(page);
}

export async function getTestCaseApp(page: Page): Promise<TestCasePageOperations> {
    return await TestCasePage.create(page);
}

export function getTestHelpers(page: Page): TestHelpers {
    return TestHelpers.create(page);
}

// Common test data generators
export const testData = {
    validUser: {
        email: 'amlana@gmail.com',
        password: 'Password@1',
        name: 'Amlana Kumar Sahoo'
    },
    invalidUser: {
        email: 'xa@gmail.com',
        password: 'Password@1'
    }
};

// Environment utilities
export function isHeadless(): boolean {
    return process.env.HEADLESS === 'true';
}

export function getBrowserType(): string {
    return process.env.BROWSER || 'chromium';
}

export function getTimeout(): number {
    return parseInt(process.env.TIMEOUT || '30000');
}


