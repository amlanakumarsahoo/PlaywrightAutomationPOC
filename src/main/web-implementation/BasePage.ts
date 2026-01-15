import { HerokuAppOperations } from "@src/main/operations/HerokuAppOperations";
export class BasePage implements HerokuAppOperations {
    protected page: any; // Assuming you have a page object from Playwright or similar
    
    async getRepoURL(): Promise<string> {
        const repoUrl = await this.page.locator('a[href*="github"]').getAttribute('href');
        return repoUrl || '';
    }
    
    async getFooterInfo(): Promise<string> {
        const footerText = await this.page.locator('footer').textContent();
        return footerText?.trim() || '';
    }
}   