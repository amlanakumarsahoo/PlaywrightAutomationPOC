import { SignUpLoginPage } from "@src/main/web-implementation/SignUpLoginPage";
import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";
import { SignUpLoginPageOperations } from "@src/main/operations/SignUpLoginPageOperations";
import { getSignUpLoginApp } from "@src/main/utilities/autoExe-utils";
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
    await signUpLoginPage.enteruserName(username);
});

Then('user should be able to enter the email address {string}', async ({page}, emailaddress: string) => {
    signUpLoginPage = await getSignUpLoginApp(page) as SignUpLoginPageOperations;
    await signUpLoginPage.enterEmailAddress(emailaddress);
});

Then('user should be able to click on signup button', async ({page}) => {
    signUpLoginPage = await getSignUpLoginApp(page) as SignUpLoginPageOperations;
    await signUpLoginPage.clickSignUpButton();
});