export interface SignUpLoginPageOperations {
    doSignUpLogin(): Promise<void|null>;
    enteruserName(username: string): Promise<void>;
    enterEmailAddress(emailAddress: string): Promise<void>;
    clickSignUpButton(): Promise<void>;
}