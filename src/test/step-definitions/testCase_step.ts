import { TestCasePageOperations } from "@src/main/operations/TestCasePageOperations";
import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";
import { getTestCaseApp } from "@src/main/utilities/autoExe-utils";

const { Given, When, Then } = createBdd(); // Decorators

export let testCasePage:TestCasePageOperations;

When('User Clicks on Test Cases tab', async ({page}) => {
    testCasePage = await getTestCaseApp(page) as TestCasePageOperations;
    await testCasePage.navigateToTestCase();
});

Then('user should be redirected to the test case page', async ({}) => {
    let actualResult = await testCasePage.getTestCaseTitle();
    expect(actualResult).toBeTruthy();  
});

Then('user verify the test case page title', async ({}) => {
    let actualResult = await testCasePage.getTestCaseTitle();
    expect(actualResult).toContain('Test Cases');
});
