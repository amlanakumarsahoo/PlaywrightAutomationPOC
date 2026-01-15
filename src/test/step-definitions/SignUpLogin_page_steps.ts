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