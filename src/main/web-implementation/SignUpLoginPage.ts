import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { SignUpLoginPageOperations } from "../operations/SignUpLoginPageOperations";

export class SignUpLoginPage extends BasePage implements SignUpLoginPageOperations {


    private readonly signupBtn: Locator;
    static doSignUpLogin: any;
    private readonly userName: Locator;
    private readonly emailAddress: Locator;
    private readonly signUpButton: Locator;

    constructor(page: any) {
        super();
        this.page = page;
        //this.signupBtn = page.locator('//*[@id="header"]/div/div/div/div[2]/div/ul/li[4]/a')
        this.signupBtn=this.page.getByRole('link', { name: ' Signup / Login' })
        this.userName = page.getByRole('textbox', { name: 'Name' })
        this.emailAddress = page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address')
        this.signUpButton = page.getByRole('button', { name: 'Signup' })
    }
    enteruserName(username: string): Promise<void> {
        return this.userName.fill(username);
        // return this.page.waitForNavigation({ waitUntil: 'networkidle' });
    }
    enterEmailAddress(emailAddress: string): Promise<void> {
        return this.emailAddress.fill(emailAddress)
        // return this.page.waitForNavigation({ waitUntil: 'networkidle' });
    }
    clickSignUpButton(): Promise<void> {
        this.signUpButton.click()
        return this.page.waitForNavigation({ waitUntil: 'networkidle' });
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