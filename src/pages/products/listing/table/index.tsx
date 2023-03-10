import Head from 'next/head';
import superjson from 'superjson';
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse
} from 'next';

import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { appRouter } from '@/server/trpc/router';
import { createContext } from '@/server/trpc/context';

import { ProductsTable } from '@/components/organisms/productsTable';

const ProductTable = () => {
  return (
    <>
      <Head>
        <title>Products</title>
        <meta name="description" content="All our products" />
      </Head>
      <ProductsTable />
    </>
  );
};

export default ProductTable;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext({ req: ctx.req as NextApiRequest, res: ctx.res as NextApiResponse }),
    transformer: superjson,
  });

  await ssg.product.getAll.prefetch({});

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};
