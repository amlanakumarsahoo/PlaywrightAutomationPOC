import { HomePageOperations } from '@src/main/operations/HomePageOperations';
import { getAutoExeApp } from '@src/main/utilities/autoExe-utils';
import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
const { Given, When, Then } = createBdd(); // Decorators
export let homePage:HomePageOperations;
let actualResult:string|null;
Given('User Visits HomePage', async ({page}) => {
  // Step: Given User Visits HomePage
  // From: src\features\home_page.feature:5:1
  homePage = await getAutoExeApp(page) as HomePageOperations;
});

When('User Observes Title', async ({}) => {
  // Step: When User Observes Title
  // From: src\features\home_page.feature:6:1
  actualResult =await homePage.getTitle();
});

Then('title should match {string}', async ({}, arg) => {
  // Step: Then title should match "Welcome to the-Internet"
  // From: src\features\home_page.feature:7:1
  expect(actualResult).toEqual(arg);
});

When('User Observes sub Title', async ({}) => {
  // Step: When User Observes sub Title
  // From: src\features\home_page.feature:11:1
  actualResult =await homePage.getSubTitle();
});

Then('sub title should match {string}', async ({}, arg: string) => {
  // Step: Then sub title should match "Available Examples"
  // From: src\features\home_page.feature:12:1

  //expect(actualResult).toEqual(arg);
});