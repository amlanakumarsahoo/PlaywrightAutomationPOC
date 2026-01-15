import { HomePageOperations } from "@src/main/operations/HomePageOperations";
import { HomePage } from "@src/main/web-implementation/HomePage";
import { Page } from "@playwright/test";
export function getHerokuAppUrl(): string {
    // Env Files
    return 'http://automationexercise.com';
}

export async function getHerokuApp(page:Page): Promise<HomePageOperations> {
    return await HomePage.create(page);
}
