import { SignUpLoginPage } from "@src/main/web-implementation/SignUpLoginPage";
import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";
import { SignUpLoginPageOperations } from "@src/main/operations/SignUpLoginPageOperations";
import { getSignUpLoginApp } from "@src/main/utilities/autoExe-utils";
import { faker } from "@faker-js/faker";

const { Given, When, Then } = createBdd()
let signUpLoginPage:SignUpLoginPageOperations;
When('User Clicks on Signup', async ({page}) => {
    signUpLoginPage = await getSignUpLoginApp(page) as SignUpLoginPageOperations;
    await signUpLoginPage.doSignUpLogin();
});

Then('user should be redirected to the signup page', async ({page}) => {
  const currentUrl = page.url();
  const pageTitle = await page.title();
  expect(currentUrl.toLowerCase()).toContain('login');
});

Then('user should be able to enter the username {string}', async ({page}, username: string) => {
    signUpLoginPage = await getSignUpLoginApp(page) as SignUpLoginPageOperations;
    await signUpLoginPage.getUserName(faker.person.firstName());
});

Then('user should be able to enter the email address {string}', async ({page}, emailaddress: string) => {
    signUpLoginPage = await getSignUpLoginApp(page) as SignUpLoginPageOperations;
    await signUpLoginPage.getEmailAddress(faker.internet.email());
});

Then('user should be able to click on signup button', async ({page}) => {
    signUpLoginPage = await getSignUpLoginApp(page) as SignUpLoginPageOperations;
    await signUpLoginPage.doSignUp();
});

Then('user should be able to verify creation of new user', async ({page}) => {
  const newCreatedUser = await signUpLoginPage.verifyCreationOfNewUser();
  expect(newCreatedUser).toBeTruthy();
});
Then('user fill the user information', async ({page}) => {
    signUpLoginPage = await getSignUpLoginApp(page) as SignUpLoginPageOperations;
    await signUpLoginPage.fillUserInfo();
});
Then('user fill the user password information', async ({page}) => {
    signUpLoginPage = await getSignUpLoginApp(page) as SignUpLoginPageOperations;
    await signUpLoginPage.getUserPassword();
});
Then('user fill the user DOB information', async ({page}) => {
    signUpLoginPage = await getSignUpLoginApp(page) as SignUpLoginPageOperations;
    await signUpLoginPage.getUserDOB();
});
Then('user fill the user news letter information', async ({page}) => {
    signUpLoginPage = await getSignUpLoginApp(page) as SignUpLoginPageOperations;
    await signUpLoginPage.getSignUpNewsLetter();
});
Then('user fill the user special offers information', async ({page}) => {
    signUpLoginPage = await getSignUpLoginApp(page) as SignUpLoginPageOperations;
    await signUpLoginPage.getReceiveSpecialOffers();
});
Then('user fill the user address information', async ({page}, dataTable) => {
    signUpLoginPage = await getSignUpLoginApp(page) as SignUpLoginPageOperations;
    const data = dataTable.hashes()[0]; // Get first row of data table
    await signUpLoginPage.getUserAddressInfo(
        data.country,
        data.state,
        data.city,
        data.zipCode,
        data.mobileNumber
    );
});
Then('user should be able to submit the signup form', async ({page}) => {
    signUpLoginPage = await getSignUpLoginApp(page) as SignUpLoginPageOperations;
    await signUpLoginPage.doSubmitForm();
});
