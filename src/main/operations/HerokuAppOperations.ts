export interface HerokuAppOperations {
    //navigate(): Promise<void>;
    getRepoURL(): Promise<string>;
    getFooterInfo(): Promise<string>;
}
