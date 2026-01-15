import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { SignUpLoginPageOperations } from "../operations/SignUpLoginPageOperations";

export class SignUpLoginPage extends BasePage implements SignUpLoginPageOperations {


    private readonly signupBtn: Locator;
    static doSignUpLogin: any;

    constructor(page: any) {
        super();
        this.page = page;
        this.signupBtn = page.locator('//*[@id="header"]/div/div/div/div[2]/div/ul/li[4]/a')
    }
    // Only Holds good in Async Libraries
    static async create(page: Page) {
        const instance = new SignUpLoginPage(page);
        return instance;
    }
    async doSignUpLogin(): Promise<void | null> {
        this.signupBtn.click();
        return this.page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    }

}