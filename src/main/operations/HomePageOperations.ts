import { HerokuAppOperations } from "@src/main/operations/HerokuAppOperations";
interface HomePageOperations  extends HerokuAppOperations{
    getTitle(): Promise<string|null>;
    getSubTitle(): Promise<string|null>;
    getAvailableExamples(): Promise<string[]|null>;
    getFooterText(): Promise<string|null>;
    gotoExample(exampleName:string): Promise<HerokuAppOperations>;
}
 export type { HomePageOperations };
