import { SignUpLoginPage } from "@src/main/web-implementation/SignUpLoginPage";
import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";
import { SignUpLoginPageOperations } from "@src/main/operations/SignUpLoginPageOperations";
import { getSignUpLoginApp } from "@src/main/utilities/autoExe-utils";
import { faker } from "@faker-js/faker";

const { Given, When, Then } = createBdd()
let signUpLoginPage: SignUpLoginPageOperations;
When('User Clicks on Signup', async ({ page }) => {
    signUpLoginPage = await getSignUpLoginApp(page) as SignUpLoginPageOperations;
    await signUpLoginPage.doSignUpLogin();
});

Then('user should be redirected to the signup page', async ({ page }) => {
    const currentUrl = page.url();
    const pageTitle = await page.title();
    expect(currentUrl.toLowerCase()).toContain('login');
});

Then('user should be able to enter the username {string}', async ({ page }, username: string) => {
    await signUpLoginPage.getUserName(faker.person.firstName());
});

Then('user should be able to enter the email address {string}', async ({ page }, emailaddress: string) => {
    await signUpLoginPage.getEmailAddress(faker.internet.email());
});

Then('user should be able to click on signup button', async ({ page }) => {
    await signUpLoginPage.doSignUp();
});

Then('user should be able to verify creation of new user', async ({ page }) => {
    const newCreatedUser = await signUpLoginPage.verifyCreationOfNewUser();
    expect(newCreatedUser).toBeTruthy();
});
Then('user fill the user information', async ({ page }) => {
    await signUpLoginPage.fillUserInfo();
});
Then('user fill the user password information', async ({ page }) => {
    await signUpLoginPage.getUserPassword();
});
Then('user fill the user DOB information', async ({ page }) => {
    await signUpLoginPage.getUserDOB();
});
Then('user fill the user news letter information', async ({ page }) => {
    await signUpLoginPage.getSignUpNewsLetter();
});
Then('user fill the user special offers information', async ({ page }) => {
    await signUpLoginPage.getReceiveSpecialOffers();
});
Then('user fill the user address information', async ({ page }, dataTable) => {
    const data = dataTable.hashes()[0]; // Get first row of data table
    await signUpLoginPage.getUserAddressInfo(
        data.country,
        data.state,
        data.city,
        data.zipCode,
        data.mobileNumber
    );
});
Then('user should be able to submit the signup form', async ({ page }) => {
    await signUpLoginPage.doSubmitForm();
});
Then('user should be able to verify account created confirmation', async ({ page }) => {
    const accountCreatedConfirmation = await signUpLoginPage.getAccountCreatedConfirmation();
    expect(accountCreatedConfirmation).toBeTruthy();
});
Then('user clicks on continue button', async ({ page }) => {
    await signUpLoginPage.doContinue();
});
Then('user should be able to verify loggedin user', async ({ page }) => {
    const loggedInUser = await signUpLoginPage.getLoggedInUser();
    expect(loggedInUser).toBeTruthy();
});
Then('user should able to delete the account', async ({ page }) => {
    await signUpLoginPage.deleteAccount();
});
Then('user verify the account deleted confirmation', async ({ page }) => {
    const accountDeletedConfirmation = await signUpLoginPage.getAccountDeletedConfirmation();
    expect(accountDeletedConfirmation).toBeTruthy();
});

Then('user login with correct email and password', async ({ page }, dataTable) => {
    const data = dataTable.hashes()[0]; // Get first row of data table
    await signUpLoginPage.getUserLoginInfo(
        data.emailaddress,
        data.password
    );
});
Then('user login with incorrect email and password', async ({ page }, dataTable) => {
    const data = dataTable.hashes()[0]; // Get first row of data table
    await signUpLoginPage.getUserLoginInfo(
        data.emailaddress,
        data.password
    );
});
Then('user should be able to verify login failed confirmation', async ({ page }) => {
    const loginFailedConfirmation = await signUpLoginPage.getLoginFailedConfirmation();
    expect(loginFailedConfirmation).toBeTruthy();
});

Then('user logout from the application', async ({ page }) => {
    await signUpLoginPage.logout(); 
});

Then('user should be on login page', async ({ page }) => {
    const currentUrl = page.url();
    const pageTitle = await page.title();
    expect(currentUrl.toLowerCase()).toContain('login');
    expect(pageTitle.toLowerCase()).toContain('login');
});

Then('user validate the error message {string}', async ({ page }, errormessage: string) => {
    const emailAlreadyExist = await signUpLoginPage.getAlreadyExistEmail();
    expect(emailAlreadyExist).toContain(errormessage);
});

Then('user should be able to enter existing username {string}', async ({ page }, username: string) => {
    await signUpLoginPage.getUserName(username);
});
Then('user should be able to enter existing email address {string}', async ({ page }, emailaddress: string) => {
    await signUpLoginPage.getEmailAddress(emailaddress);
});
