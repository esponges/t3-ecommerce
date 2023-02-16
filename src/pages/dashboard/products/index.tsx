import { ProductsTable } from '@/components/organisms/productsTable';
import { PageRoutes } from '@/lib/routes';
import Head from 'next/head';

const AdminProducts = () => {
  return (
    <>
      <Head>
        {/* no index */}
        <meta name="robots" content="noindex" />
        <title>Productos</title>
      </Head>
      <ProductsTable productsUrl={PageRoutes.AdminProducts} />
    </>
  );
};

AdminProducts.requireAuth = true;

export default AdminProducts;


