import { useRouter } from 'next/router';
import Head from 'next/head';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
  InferGetServerSidePropsType
} from 'next'
import superjson from 'superjson';

import { Loader } from '@/components/molecules/loader';
import { Button } from '@/components/atoms/button';
import { Container } from '@/components/molecules/container';

import { ProductItem } from '@/components/molecules/productItem';
import { useCartActions } from '@/store/cart';
import { trpc } from '@/utils/trpc';
import { appRouter } from '@/server/trpc/router';
import { createContext } from '@/server/trpc/context';

const ProductDetails = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const router = useRouter();
  const name = props.name;
  
  // this query is automatically prefetched on server side
  const { data: product, isLoading } = trpc.product.getByName.useQuery({ name });

  const { addToCart } = useCartActions();

  const handleAddToCart = (qty: number) => {
    if (product) {
      addToCart(product, qty);
    }
  };

  if (isLoading) {
    return <Loader text />;
  }

  return (
    <Container>
      <Head>
        <title>{product?.name}</title>
        <meta name="description" content={product?.description} />
      </Head>
      <ProductItem
        name={product?.name}
        price={product?.price}
        description={product?.description}
        image={product?.image}
        id={product?.id}
        category={product?.category}
        onAddToCart={handleAddToCart}
      />
      <div className="mt-5 flex justify-center">
        <Button variant="primary" extraClassName="mr-4" onClick={() => router.push('/cart')}>
          Ir al carrito
        </Button>
        <Button variant="secondary" className="mt-5" onClick={() => router.push('/')}>
          Regresar
        </Button>
      </div>
    </Container>
  );
};

export default ProductDetails;

// prefetch data on server side for better SEO
// https://trpc.io/docs/ssg-helpers
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext({
      req: ctx.req as NextApiRequest,
      res: ctx.res as NextApiResponse,
    }),
    transformer: superjson,
  });

  const name = ctx.params?.name as string;

  await ssg.product.getByName.prefetch({ name });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      name,
    },
  };
};
