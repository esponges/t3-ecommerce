import { ProductsTable } from '@/components/organisms/productsTable';
import { PageRoutes } from '@/lib/routes';
import Head from 'next/head';

const AdminProducts = () => {
  // redirect by id instead of name
  const getProductUrl = (id: string) => {
    return `${PageRoutes.AdminProducts}/${id}`;
  };

  return (
    <>
      <Head>
        {/* no index */}
        <meta name="robots" content="noindex" />
        <title>Productos</title>
      </Head>
      <ProductsTable productsUrl={PageRoutes.AdminProducts} getProductUrl={getProductUrl} />
    </>
  );
};

AdminProducts.requireAuth = true;

export default AdminProducts;


