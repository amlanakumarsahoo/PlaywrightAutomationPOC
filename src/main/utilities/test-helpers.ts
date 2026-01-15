import { Page, Locator, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

export class TestHelpers {
    constructor(private page: Page) {}

    /**
     * Factory method to create TestHelpers instance
     */
    static create(page: Page): TestHelpers {
        return new TestHelpers(page);
    }

    // Wait utilities
    async waitForElement(selector: string, timeout: number = 10000): Promise<Locator> {
        const element = this.page.locator(selector);
        await element.waitFor({ timeout });
        return element;
    }

    async waitForText(text: string, timeout: number = 10000): Promise<Locator> {
        const element = this.page.getByText(text);
        await element.waitFor({ timeout });
        return element;
    }

    async waitForUrl(urlPattern: string | RegExp, timeout: number = 10000): Promise<void> {
        await this.page.waitForURL(urlPattern, { timeout });
    }

    // Form utilities
    async fillFormField(selector: string, value: string, options?: { timeout?: number }): Promise<void> {
        const element = await this.waitForElement(selector, options?.timeout);
        await element.clear();
        await element.fill(value);
    }

    async selectDropdownOption(selector: string, value: string, options?: { timeout?: number }): Promise<void> {
        const element = await this.waitForElement(selector, options?.timeout);
        await element.selectOption(value);
    }

    async clickElement(selector: string, options?: { timeout?: number }): Promise<void> {
        const element = await this.waitForElement(selector, options?.timeout);
        await element.click();
    }

    async checkCheckbox(selector: string, options?: { timeout?: number }): Promise<void> {
        const element = await this.waitForElement(selector, options?.timeout);
        if (!(await element.isChecked())) {
            await element.check();
        }
    }

    async uncheckCheckbox(selector: string, options?: { timeout?: number }): Promise<void> {
        const element = await this.waitForElement(selector, options?.timeout);
        if (await element.isChecked()) {
            await element.uncheck();
        }
    }

    // Validation utilities
    async verifyElementVisible(selector: string, timeout: number = 5000): Promise<boolean> {
        try {
            const element = this.page.locator(selector);
            await element.waitFor({ state: 'visible', timeout });
            return true;
        } catch {
            return false;
        }
    }

    async verifyElementHidden(selector: string, timeout: number = 5000): Promise<boolean> {
        try {
            const element = this.page.locator(selector);
            await element.waitFor({ state: 'hidden', timeout });
            return true;
        } catch {
            return false;
        }
    }

    async verifyTextContent(selector: string, expectedText: string): Promise<boolean> {
        const element = await this.waitForElement(selector);
        const actualText = await element.textContent();
        return actualText?.includes(expectedText) || false;
    }

    async verifyElementCount(selector: string, expectedCount: number): Promise<boolean> {
        const elements = this.page.locator(selector);
        const actualCount = await elements.count();
        return actualCount === expectedCount;
    }

    // Navigation utilities
    async navigateToUrl(url: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
        await this.page.goto(url, { waitUntil: options?.waitUntil || 'networkidle' });
    }

    async goBack(): Promise<void> {
        await this.page.goBack({ waitUntil: 'networkidle' });
    }

    async goForward(): Promise<void> {
        await this.page.goForward({ waitUntil: 'networkidle' });
    }

    async refreshPage(): Promise<void> {
        await this.page.reload({ waitUntil: 'networkidle' });
    }

    // Screenshot utilities
    async takeScreenshot(name?: string): Promise<Buffer> {
        const screenshotName = name || `screenshot-${Date.now()}`;
        return await this.page.screenshot({
            path: `./test-results/screenshots/${screenshotName}.png`,
            fullPage: true
        });
    }

    async takeElementScreenshot(selector: string, name?: string): Promise<Buffer> {
        const element = await this.waitForElement(selector);
        const screenshotName = name || `element-screenshot-${Date.now()}`;
        return await element.screenshot({
            path: `./test-results/screenshots/${screenshotName}.png`
        });
    }

    // Data generation utilities
    generateRandomEmail(): string {
        return faker.internet.email();
    }

    generateRandomPassword(length: number = 12): string {
        return faker.internet.password({ length });
    }

    generateRandomName(): string {
        return faker.person.fullName();
    }

    generateRandomPhoneNumber(): string {
        return faker.phone.number();
    }

    generateRandomAddress(): {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    } {
        return {
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zipCode: faker.location.zipCode(),
            country: faker.location.country()
        };
    }

    // Assertion utilities
    async assertElementVisible(selector: string, message?: string): Promise<void> {
        const element = this.page.locator(selector);
        await expect(element, message).toBeVisible();
    }

    async assertElementHidden(selector: string, message?: string): Promise<void> {
        const element = this.page.locator(selector);
        await expect(element, message).toBeHidden();
    }

    async assertTextContent(selector: string, expectedText: string, message?: string): Promise<void> {
        const element = this.page.locator(selector);
        await expect(element, message).toContainText(expectedText);
    }

    async assertUrl(expectedUrl: string | RegExp, message?: string): Promise<void> {
        await expect(this.page, message).toHaveURL(expectedUrl);
    }

    async assertTitle(expectedTitle: string | RegExp, message?: string): Promise<void> {
        await expect(this.page, message).toHaveTitle(expectedTitle);
    }

    // Cookie utilities
    async setCookie(name: string, value: string, domain?: string): Promise<void> {
        await this.page.context().addCookies([{
            name,
            value,
            domain: domain || new URL(this.page.url()).hostname,
            path: '/'
        }]);
    }

    async getCookie(name: string): Promise<string | undefined> {
        const cookies = await this.page.context().cookies();
        const cookie = cookies.find(c => c.name === name);
        return cookie?.value;
    }

    async clearCookies(): Promise<void> {
        await this.page.context().clearCookies();
    }

    // Local storage utilities
    async setLocalStorage(key: string, value: string): Promise<void> {
        await this.page.addInitScript(`
            localStorage.setItem('${key}', '${value}');
        `);
    }

    async getLocalStorage(key: string): Promise<string | null> {
        return await this.page.evaluate(`localStorage.getItem('${key}')`);
    }

    async clearLocalStorage(): Promise<void> {
        await this.page.evaluate('localStorage.clear()');
    }
}
