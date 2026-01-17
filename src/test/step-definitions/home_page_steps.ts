import { HomePageOperations } from '@src/main/operations/HomePageOperations';
import { getAutoExeApp } from '@src/main/utilities/autoExe-utils';
import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
const { Given, When, Then } = createBdd(); // Decorators
export let homePage:HomePageOperations;
let actualResult:string|null;
Given('User Visits HomePage', async ({page}) => {
  homePage = await getAutoExeApp(page) as HomePageOperations;
});

When('User Observes HomePage Title', async ({}) => {
  actualResult =await homePage.getTitle();
});

Then('title should match {string}', async ({}, arg) => {
  expect(actualResult).toEqual(arg);
});

When('User Observes sub Title', async ({}) => {
  actualResult =await homePage.getSubTitle();
});

Then('sub title should match {string}', async ({}, arg: string) => {
  expect(actualResult).toEqual(arg);
});