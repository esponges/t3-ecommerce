export enum PageRoutes {
  // Layout
  Home = "/",
  Cart = "/cart",
  Checkout = "/checkout",
  // login
  Login = "/auth/login",
  // Account
  Account = "/auth/account",
  // Products
  // Products = "/products",
  Product = "/products/[name]",
  Products = "/products",
  List = "/products/listing",
  ListTable = "/products/listing/table",
  // Admin
  // ...
  AdminProducts = "/dashboard/products",
  AdminProductsDetails = '/dashboard/products/details',
  // about
  Privacy = "/about/privacy-policy",
  Terms = "/about/terms",
  DataPolicy = "/about/data-policy",
}

export const getProductDetailsRoute = (path: string, name: string) => {
  const encodedName = encodeURIComponent(name);
  return `${path}/${encodedName}`;
};
