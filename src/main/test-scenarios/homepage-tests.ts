import {test,expect} from '@playwright/test';
import {HomePageOperations} from '@src/main/operations/HomePageOperations';
import {getHerokuAppUrl,getHerokuApp} from '@src/main/utilities/herokuapp-utils';
test("Verify Home Page Title",async({page})=>{
    const homePage:HomePageOperations = await getHerokuApp(page);
    const title=await homePage.getTitle();
    expect(title).toBe("Welcome to the-internet");
});
test("Verify Home Page SubTitle",async({page})=>{
    // Arrange
    const homePage:HomePageOperations = await getHerokuApp(page);
    const expectedSubTitle="Available Examples";
    // Input AccunytInput = { username: "testuser", password: "testpass" };
    // Act
    const subTitle=await homePage.getSubTitle();
    // Assert
    expect(subTitle).toBe(expectedSubTitle);
});
test("Verify Available Examples on Home Page",async({page})=>{
    const homePage:HomePageOperations = await getHerokuApp(page);
    //await page.Wa
    const examples = await homePage.getAvailableExamples();
    const expectedCount=44;
    //expect.soft(examples?.length);
    expect(examples?.length).toBe(expectedCount);
});
test("Verify Home Page Banner Info",async({page})=>{});
test("Verify Home Page Footer Text",async({page})=>{});

test("Navigate to Example Page from Home Page",async({page})=>{
    // // Arrange
    // const testPage = "A/B Testing"
    // // Expected A/B Test Variation 1
    // const homePage:HomePageOperations = await getHerokuApp(page);
    // // Act
    // const returnPage = homePage.gotoExample(testPage) as ABTestingOperations;

    // // Can Be success or Error
    // const actual = returnPage.getTitle();
    // // Assert

});