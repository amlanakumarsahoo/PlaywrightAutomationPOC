import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { SignUpLoginPageOperations } from "../operations/SignUpLoginPageOperations";
import { faker } from "@faker-js/faker";

export class SignUpLoginPage extends BasePage implements SignUpLoginPageOperations {
    private readonly signupBtn: Locator;
    static doSignUpLogin: any;
    private readonly userName: Locator;
    private readonly emailAddress: Locator;
    private readonly signUpButton: Locator;
    private readonly newCreatedUser: Locator;
    private readonly password: Locator;
    private readonly userDOB_day: Locator;
    private readonly userDOB_month: Locator;
    private readonly userDOB_year: Locator;
    private readonly signUpNewsLetter: Locator;
    private readonly receiveSpecialOffers: Locator;
    private readonly userAddressInfo: Locator;
    private readonly firstName: Locator;
    private readonly lastName: Locator;
    private readonly company: Locator;
    private readonly address1: Locator;
    private readonly address2: Locator;
    private readonly country: Locator;
    private readonly state: Locator;
    private readonly city: Locator;
    private readonly zipCode: Locator;
    private readonly mobileNumber: Locator;
    private readonly createAccountButton: Locator;

    constructor(page: any) {
        super();
        this.page = page;
        //this.signupBtn = page.locator('//*[@id="header"]/div/div/div/div[2]/div/ul/li[4]/a')
        this.signupBtn=this.page.getByRole('link', { name: ' Signup / Login' })
        this.userName = page.getByRole('textbox', { name: 'Name' })
        this.emailAddress = page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address')
        this.signUpButton = page.locator('[data-qa="signup-button"]');
        this.newCreatedUser = page.locator("#name");
        this.password = page.locator("#password");
        this.userDOB_day = page.locator("#days");
        this.userDOB_month = page.locator("#months");
        this.userDOB_year = page.locator("#years");
        this.signUpNewsLetter = page.locator("#newsletter");
        this.receiveSpecialOffers = page.locator("#optin");
        this.userAddressInfo = page.locator("#address");
        this.firstName = page.locator("#first_name");
        this.lastName = page.locator("#last_name");
        this.company = page.locator("#company");
        this.address1 = page.locator("#address1");
        this.address2 = page.locator("#address2");
        this.country = page.locator("#country");
        this.state = page.locator("#state");
        this.city = page.locator("#city");
        this.zipCode = page.locator("#zipcode");
        this.mobileNumber = page.locator("#mobile_number");
        this.createAccountButton = page.locator("[data-qa='create-account']");
        }
    [x: string]: any;
    async getUserPassword(): Promise<void> {
        await this.password.fill(faker.person.firstName()+"@123");
    }
    async getUserName(username: string): Promise<void> {
        await this.userName.fill(username);
    }
    async getEmailAddress(emailAddress: string): Promise<void> {
        await this.emailAddress.fill(emailAddress)
    }
    async doSignUp(): Promise<void> {
        await this.page.waitForLoadState('networkidle')
        await this.signUpButton.click();
    }
    static async create(page: Page) {
        const instance = new SignUpLoginPage(page);
        return instance;
    }
    async doSignUpLogin(): Promise<void | null> {
        await this.signupBtn.click();
        // return this.page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    }
    async verifyCreationOfNewUser(): Promise<boolean | null> {
        if(await this.newCreatedUser.isVisible()) {
            return true;
        }
        return false;
    }

    async getUserDOB(): Promise<void>{
        // Generate day (1-31, matching available options)
        const day = faker.number.int({ min: 1, max: 31 }).toString();
        await this.userDOB_day.selectOption(day, {timeout: 5000});
        
        // Generate month name (matching dropdown options)
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        const month = faker.helpers.arrayElement(months);
        await this.userDOB_month.selectOption(month, {timeout: 5000});
        
        // Generate year within available range (1900-2021)
        const year = faker.number.int({ min: 1900, max: 2021 }).toString();
        await this.userDOB_year.selectOption(year, {timeout: 5000});
    }
 
    async getSignUpNewsLetter(): Promise<void> {
        await this.signUpNewsLetter.click();
    }
    async getReceiveSpecialOffers(): Promise<void> {
        await this.receiveSpecialOffers.click();
    }
    async getUserAddressInfo(country: string, state: string, city: string, zipCode: string, mobileNumber: string): Promise<void> {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const company = faker.company.name();
        const address1 = faker.location.streetAddress();
        const address2 = faker.location.streetAddress();
        await this.firstName.fill(firstName,{timeout:5000});
        await this.lastName.fill(lastName,{timeout:5000});
        await this.company.fill(company,{timeout:5000});
        await this.address1.fill(address1,{timeout:5000});
        await this.address2.fill(address2,{timeout:5000});
        await this.country.selectOption(country,{timeout:5000});
        await this.state.fill(state,{timeout:5000});
        await this.city.fill(city,{timeout:5000});
        await this.zipCode.fill(zipCode,{timeout:5000});
        const usPhone = faker.string.numeric(10);
        await this.mobileNumber.fill(usPhone,{timeout:5000});
        console.log(`User Address Information: First Name: ${firstName}, Last Name: ${lastName}, Company: ${company}, Address1: ${address1}, Address2: ${address2}, Country: ${country}, State: ${state}, City: ${city}, Zip Code: ${zipCode}, Mobile Number: ${usPhone}`);
    }
    async doSubmitForm(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
        await this.createAccountButton.click({ timeout: 5000 }); 
    }
}