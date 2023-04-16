import { useRouter } from 'next/router';
import Head from 'next/head';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
  InferGetServerSidePropsType
} from 'next';
import superjson from 'superjson';
import {
  Icon,
  Label,
  Menu,
  Modal
} from 'semantic-ui-react';
import { useState } from 'react';

import { Loader } from '@/components/molecules/loader';
import { Button } from '@/components/atoms/button';

import { ProductItem } from '@/components/molecules/productItem';
import { useCartActions } from '@/store/cart';
import { trpc } from '@/lib/trpc';
import { appRouter } from '@/server/trpc/router';
import { createContext } from '@/server/trpc/context';
import { PageContainer } from '@/components/layouts/pageContainer';
import { ProductCarousel } from '@/components/organisms/productCarousel';

const ProductDetails = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
  const [productDetails, setProductDetails] = useState<string | undefined>(undefined);

  const { name } = props;
  // this query is automatically prefetched on server side
  const { data: product, isLoading } = trpc.product.getBy.useQuery({ name });
  const {
    data: apiProductDetails,
    isLoading: productDetailsIsLoading,
    mutateAsync: getAIDetails,
    isError,
  } = trpc.product.getAIDetails.useMutation();

  const { addToCart } = useCartActions();

  const handleAddToCart = (qty: number) => {
    if (product) {
      addToCart(product, qty);
    }
  };

  const handleGetapiProductDetails = async () => {
    const details = await getAIDetails({ name });
    if (details.message !== 'Error') {
      setProductDetails(details.message);
    }
  };

  const handleToggleDetailsModal = () => {
    setIsOpenDetailsModal((prev) => !prev);
  };

  if (isLoading) {
    return <Loader text />;
  }

  console.log('apiProductDetails', apiProductDetails, 'productDetailsIsLoading', productDetailsIsLoading);

  return (
    <PageContainer verticallyCentered>
      <Head>
        <title>{product?.name}</title>
        <meta
          name="description"
          content={product?.description || `${product?.name || ''} ${product?.price || ''}`}
        />
      </Head>
      <ProductItem
        name={product?.name}
        price={product?.price}
        description={product?.description}
        image={product?.image}
        id={product?.id}
        stock={product?.stock}
        category={product?.category}
        onAddToCart={handleAddToCart}
        productSpecs={product?.productSpecs}
      />
      <Modal
        onClose={handleToggleDetailsModal}
        onOpen={handleToggleDetailsModal}
        open={isOpenDetailsModal}
        size="mini"
        closeIcon
        trigger={
          <Menu compact>
            <Menu.Item as="a">
              <Icon name="gem" /> Get Details
              <Label
                color="red"
                floating
              >
                Powered with AI
              </Label>
            </Menu.Item>
          </Menu>
        }
      >
        <Modal.Header>{product?.name}</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <div
              className="text-md font-bold"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {(!isError && !productDetails && !productDetailsIsLoading ) ? 'No details fetched yet' : null}
              {!isError && productDetailsIsLoading ? 'Loading...' : null}
              {!isError && !!productDetails && productDetails ? productDetails : null}
              {isError ? 'Error fetching details' : null}
            </div>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button
            variant="primary"
            disabled={productDetailsIsLoading || !!productDetails || isError}
            onClick={handleGetapiProductDetails}
          >
            Get Details with AI <Icon name="gem" />
          </Button>
        </Modal.Actions>
      </Modal>
      <ProductCarousel
        showDescriptions={false}
        category={product?.category}
        tag="Related Products"
        ignoredIds={product?.id ? [product.id] : undefined}
      />
      <div className="my-5 flex justify-center">
        <Button
          variant="primary"
          className="mr-4"
          onClick={() => router.push('/cart')}
        >
          Go to cart
        </Button>
        <Button
          variant="secondary"
          onClick={() => router.push('/')}
        >
          Go Back
        </Button>
      </div>
    </PageContainer>
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

  await ssg.product.getBy.prefetch({ name });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      name,
    },
  };
};
