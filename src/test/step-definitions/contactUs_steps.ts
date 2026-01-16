import { ContactusOperations } from "@src/main/operations/ContactusOperations";
import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";
import { getContactUsApp } from "@src/main/utilities/autoExe-utils";

const { Given, When, Then } = createBdd(); // Decorators

export let contactUsPage:ContactusOperations;

When('User Clicks on Contact Us', async ({page}) => {
    contactUsPage = await getContactUsApp(page) as ContactusOperations;
    await contactUsPage.navigateToContactUs();
});

Then('user should be redirected to the contact us page', async ({}) => {
    let actualResult = await contactUsPage.getContactUsTitle();
    expect(actualResult).toBeTruthy();  
});

When('User fills the contact us form', async ({}, dataTable) => {
    const data = dataTable.hashes()[0]; // Get first row of data table
    await contactUsPage.fillContactUsForm(
        data.Name, 
        data.Email, 
        data.Subject, 
        data.Message);
});

When('User attaches a file', async ({}, dataTable) => {
    const data = dataTable.hashes()[0]; // Get first row of data table
    await contactUsPage.attachFile(data.filepath);
});

When('User submits the contact us form', async ({}) => {
    await contactUsPage.submitContactUsForm();
});
