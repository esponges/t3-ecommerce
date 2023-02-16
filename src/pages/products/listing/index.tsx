import Head from 'next/head';
import superjson from 'superjson';
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse
} from 'next';

import { ProductSearchbar } from '@/components/molecules/productSearchbar';
import { ProductCarousel } from '@/components/organisms/productCarousel';

import { trpc } from '@/lib/trpc';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { appRouter } from '@/server/trpc/router';
import { createContext } from '@/server/trpc/context';
import { Heading, HeadingSizes } from '@/components/atoms/heading';

const ProductListing = () => {
  const { data: categories } = trpc.category.getAll.useQuery();

  return (
    <>
      <Head>
        <meta name="description" content="Lista de productos por categoría" />
        <title>Productos</title>
        <link rel="icon" href="/v-icon.ico" />
      </Head>
      {/* no need PageContainer here */}
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <Heading size={HeadingSizes['xl']}>¿Buscas algo específico?</Heading>
        <ProductSearchbar />
        <ul className="mt-4 flex w-full flex-col gap-4">
          {categories?.length &&
            categories.map((category) => (
              <ProductCarousel showDescriptions={false} key={category.id} category={category} />
            ))}
        </ul>
      </div>
    </>
  );
};

export default ProductListing;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext({ req: ctx.req as NextApiRequest, res: ctx.res as NextApiResponse }),
    transformer: superjson,
  });

  await ssg.category.getAll.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};
