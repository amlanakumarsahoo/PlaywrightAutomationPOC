export interface ProductsPageOperations {
    navigateToProductsPage(): Promise<void>;
    verifyAllProductsPage(): Promise<string>;
    verifyProductListCount(): Promise<number>;
    viewFirstProduct(): Promise<void>;
    verifyProductDetails(): Promise<boolean>;
}