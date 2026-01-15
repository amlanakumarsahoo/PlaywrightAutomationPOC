import { AutoExeAppOperations } from "@src/main/operations/AutoExeAppOperations";
interface HomePageOperations  extends AutoExeAppOperations{
    getTitle(): Promise<string|null>;
    getSubTitle(): Promise<string|null>;
    getAvailableExamples(): Promise<string[]|null>;
    getFooterText(): Promise<string|null>;
    gotoExample(exampleName:string): Promise<AutoExeAppOperations>;
}
 export type { HomePageOperations };
