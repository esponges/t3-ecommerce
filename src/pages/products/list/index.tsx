import Head from 'next/head';
import superjson from 'superjson';
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';

import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { appRouter } from '@/server/trpc/router';
import { trpc } from '@/utils/trpc';
import { createContext } from '@/server/trpc/context';

import { Container } from '@/components/molecules/container';
import { Header } from '@/components/atoms/header';

const ProductList = () => {
  const { data } = trpc.product.getAll.useQuery();
  trpc
  return (
    <>
      <Container>
        <Head>
          <title>List</title>
          <meta name="description" content="All our available products" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header>Products</Header>
      </Container>
    </>
  );
};

export default ProductList;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext({ req: ctx.req as NextApiRequest, res: ctx.res as NextApiResponse }),
    transformer: superjson,
  });

  await ssg.product.getAll.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};
