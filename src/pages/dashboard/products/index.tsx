import { Button } from '@/components/atoms/button';
import { ProductsTable } from '@/components/organisms/productsTable';
import { PageRoutes } from '@/lib/routes';
import Head from 'next/head';

const AdminProducts = () => {
  // redirect by id instead of name
  const productDetailsUrl = `${PageRoutes.AdminProductsDetails}?id=`;
  const getProductUrl = (id: string) => {
    return `${productDetailsUrl}${id}`;
  };

  return (
    <div className='text-center'>
      <Head>
        {/* no index */}
        <meta name="robots" content="noindex" />
        <title>Productos</title>
      </Head>
      <Button
        variant='link'
        className='mt-6'
        href={PageRoutes.AdminProductsDetails}
      >
        Nuevo producto
      </Button>
      <ProductsTable title='Lista de productos' productsUrl={productDetailsUrl} getProductUrl={getProductUrl} />
    </div>
  );
};

AdminProducts.requireAuth = true;
AdminProducts.requireAdmin = true;

export default AdminProducts;


