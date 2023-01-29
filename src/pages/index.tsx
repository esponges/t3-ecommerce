import Head from 'next/head';
import superjson from 'superjson';
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse
} from 'next'
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { ProductSearchbar } from '@/components/molecules/productSearchbar';
import { ProductCarousel } from '@/components/organisms/productCarousel';

import { trpc } from '@/utils/trpc';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { appRouter } from '@/server/trpc/router';
import { createContext } from '@/server/trpc/context';

import { Pill } from '@/components/atoms/pill';
import { Image } from '@/components/atoms/image';
import { env } from '@/env/client.mjs';
import { useDeviceWidth } from '@/lib/hooks/useDeviceWidth';

const carouselUrls = [
  `${env.NEXT_PUBLIC_IMAGEKIT_URL}/hero-1.png?ik-sdk-version=javascript-1.4.3&updatedAt=1674086938720`,
  `${env.NEXT_PUBLIC_IMAGEKIT_URL}/hero-2.png?ik-sdk-version=javascript-1.4.3&updatedAt=1674086938776`,
  `${env.NEXT_PUBLIC_IMAGEKIT_URL}/hero-3.png?ik-sdk-version=javascript-1.4.3&updatedAt=1674086938742`,
];

const Home = () => {
  const { data: categories } = trpc.category.getAll.useQuery();
  const { isMobile } = useDeviceWidth();

  return (
    <>
      <Head>
        <meta name="description" content="Vinoreo Home Page" />
        <link rel="icon" href="/v-icon.ico" />
      </Head>
      <div className="container mx-auto flex flex-col items-center justify-center p-4 md:min-h-screen">
        <Carousel
          showStatus={false}
          showArrows={true}
          showThumbs={false}
          infiniteLoop
          autoPlay
          interval={3500}
          transitionTime={1000}
          className="w-full md:w-3/4"
        >
          {carouselUrls.map((url, idx) => {
            return (
              <div key={url}>
                <Image path={url} className="w-full object-cover" alt={`Home Hero Image ${idx + 1}`} />
              </div>
            );
          })}
        </Carousel>
        <ul className="my-6 flex w-full flex-wrap pl-0 md:my-12 md:w-1/2">
          {categories?.map((category) => {
            return (
              <li className="flex-auto text-center" key={category.id}>
                <Pill
                  href={`/category/${category.id}`}
                  roundedStyle="rounded-md"
                  className="m-1 bg-blue-200 text-lg md:m-4 "
                >
                  {category.name}
                </Pill>
              </li>
            );
          })}
        </ul>
        <h3 className="mt-6 text-xl font-bold text-gray-700">¿Estás buscando algo?</h3>
        <ProductSearchbar className="mb-6 md:mb-12" />
        <ProductCarousel showDescriptions={!isMobile} tag="Los Más Vendidos" tagClassName="text-4xl" favorite={true} />
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
  // we'll set limit to 4 for now since we don't have a way to know the screen size
  // on the server side
  await ssg.product.getBatch.prefetch({ favorite: true, limit: 4 });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};
