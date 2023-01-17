import Head from 'next/head';
import superjson from 'superjson';
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 

import { ProductSearchbar } from '@/components/molecules/productSearchbar';
import { ProductCarousel } from '@/components/organisms/productCarousel';

import { trpc } from '@/utils/trpc';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { appRouter } from '@/server/trpc/router';
import { createContext } from '@/server/trpc/context';
import { IKImage } from 'imagekitio-react';
import { env } from '@/env/client.mjs';

const carouselUrls = [
  '/hero-1.png?ik-sdk-version=javascript-1.4.3&updatedAt=1673917229291',
  '/hero-2.png?ik-sdk-version=javascript-1.4.3&updatedAt=1673917231502',
  '/hero-3.png?ik-sdk-version=javascript-1.4.3&updatedAt=1673917229711',
];

const Home = () => {
  const { data: categories } = trpc.category.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Vinoreo</title>
        <meta name="description" content="Main Store Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold text-gray-700">Bienvenido</h1>
        <Carousel
          // showThumbs={false}
          showStatus={false}
          // showIndicators={false}
          infiniteLoop
          autoPlay
          interval={2500}
          transitionTime={1000}
          className="w-full"
        >
          {carouselUrls.map((url) => {
            return (
              <div key={url}>
                <IKImage
                  urlEndpoint={env.NEXT_PUBLIC_IMAGEKIT_URL}
                  path={url}
                  // transformation={[{ height: 500, width: 500 }]}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            );
          })}
        </Carousel>
        <h3 className="mt-6 text-xl font-bold text-gray-700">What are you looking for?</h3>
        <ProductSearchbar />
      </div>
    </>
  );
};

export default Home;

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
