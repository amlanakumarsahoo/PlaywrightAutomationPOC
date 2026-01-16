import { HomePageOperations } from "@src/main/operations/HomePageOperations";
import { BasePage } from "@src/main/web-implementation/BasePage";
import {Page, Locator} from '@playwright/test';
import { getAutoExeUrl } from "@src/main/utilities/autoExe-utils";
export class HomePage extends BasePage implements HomePageOperations {
    //private readonly page;
    private readonly subTitleSelector:Locator; // data-testid = subtitle
    private readonly titleSelector:Locator;
    private readonly exampleSelector:Locator;
    private readonly signupSelector:Locator;
    constructor(page: any) {
        super();
        this.page = page;
        //this.page.locator.
        this.titleSelector = page.locator('//meta[@name="google-site-verification"]/following-sibling::title'); // data-testid = 'home-title'
        this.subTitleSelector = page.locator('h2'); // data-testid = 'home-subtitle'
        // this.exampleSelector = page.getByRole('listitem'); // data-testid = 'example-link'
        this.exampleSelector = page.locator('#content > ul > li > a');
        this.signupSelector = page.locator('//*[@id="header"]/div/div/div/div[2]/div/ul/li[4]/a');
        //this.page.goto(getHerokuAppUrl());
        //this.navigate();
    }
    doSignup(): Promise<void|null> {
        this.signupSelector.click();
        this.page.getUrl();
        return this.page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    }
    // Only Holds good in Async Libraries
    static async create(page:Page) {
          const instance = new HomePage(page);
          // Do async initialization here
          await instance.navigate();
          return instance;
        }
      
    async navigate(): Promise<void> {
        // Log the properties of 
        await this.page.goto(getAutoExeUrl());
    }

    getFooterText(): Promise<string | null> {
        throw new Error("Method not implemented.");
    }
    async gotoExample(exampleName: string): Promise<HomePageOperations> {
        const link = this.page.getByRole('link', { name: exampleName }).first();
        await link.waitFor({ state: 'visible', timeout: 15000 });
        await Promise.all([
            this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
            link.click()
        ]);
        return CheckPageAndReturnPO(this.page, exampleName);
       
    }
    async getSubTitle(): Promise<string|null> {
        await this.page.waitForLoadState('domcontentloaded');
        return this.subTitleSelector.textContent();
    }
    async getAvailableExamples(): Promise<string[]|null> {
        await this.page.waitForLoadState('domcontentloaded');
        return this.exampleSelector.allTextContents();
    }
    async getTitle(): Promise<string|null> {
        // Implementation to get the title from the home page
        //await this.page.waitForLoadState('domcontentloaded');
        return this.titleSelector.textContent();
    }}   

function CheckPageAndReturnPO(page, expectedTitle) {
    const abTestingPageModule = require('@src/web-implementation/ABTestingPage');
    // Exception Handling
    return new abTestingPageModule.ABTestingPage(page);
}
