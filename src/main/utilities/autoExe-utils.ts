import { HomePageOperations } from "@src/main/operations/HomePageOperations";
import { HomePage } from "@src/main/web-implementation/HomePage";
import { Page } from "@playwright/test";
import { SignUpLoginPage } from "../web-implementation/SignUpLoginPage";
import { SignUpLoginPageOperations } from "../operations/SignUpLoginPageOperations";
export function getHerokuAppUrl(): string {
    // Env Files
    return 'http://automationexercise.com';
}

export async function getAutoExeApp(page:Page): Promise<HomePageOperations> {
    return await HomePage.create(page);
}

export async function getSignUpLoginApp(page:Page): Promise<SignUpLoginPageOperations> {
    return await SignUpLoginPage.create(page);
}
