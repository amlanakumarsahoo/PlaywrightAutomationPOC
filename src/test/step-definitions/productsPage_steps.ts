import { ProductsPageOperations } from "@src/main/operations/ProductsPageOperations";
import { getProductsPageApp } from "@src/main/utilities/autoExe-utils";
import { createBdd } from "playwright-bdd";
import { expect } from "@playwright/test";

export let productsPage: ProductsPageOperations;

const { Given, When, Then } = createBdd();

When('User navigates to Products tab', async ({page}) => {
    productsPage = await getProductsPageApp(page) as ProductsPageOperations;
    await productsPage.navigateToProductsPage();

});

Then('User should be redirected to All Products page', async ({}) => {
    expect(await productsPage.verifyAllProductsPage()).toBe('All Products');

});

Then('User verifies product list visibility', async ({}) => {
   
});

Then('User clicks on first product', async ({}) => {
    await productsPage.viewFirstProduct();
});

Then('User landed to product detail page', async ({}) => {
    await productsPage.verifyProductDetails();
    expect(await productsPage.verifyProductDetails()).toBeTruthy();
});

Then('User verifies product name, category, price, availability, condition, brand', async ({}) => {
    expect(await productsPage.verifyProductDetails()).toBeTruthy();
});

