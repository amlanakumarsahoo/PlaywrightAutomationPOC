export interface ProductsPageOperations {
    navigateToProductsPage(): Promise<void>;
    verifyAllProductsPage(): Promise<string>;
    getAllProductsList(): Promise<string[]>;
    viewFirstProduct(): Promise<void>;
    verifyProductDetails(): Promise<boolean>;
}