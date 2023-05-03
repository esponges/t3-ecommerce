import Image from 'next/image';
import Head from 'next/head';
import superjson from 'superjson';
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse
} from 'next';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { ProductSearchbar } from '@/components/molecules/productSearchbar';
import { ProductCarousel } from '@/components/organisms/productCarousel';

import { trpc } from '@/lib/trpc';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { appRouter } from '@/server/trpc/router';
import { createContext } from '@/server/trpc/context';
import FeatureLink from '@/components/atoms/featureLink';
import { Loader } from '@/components/molecules/loader';

const heroImages = ['/images/hero/poke-hero-1.png', '/images/hero/poke-hero-2.png'];

const Home = () => {
  const { data: categories, isLoading: loadingCategories } = trpc.category.getAll.useQuery();

  return (
    <>
      <Head>
        <meta
          name="description"
          content="Store Home Page"
        />
        <link
          rel="icon"
          href="/v-icon.ico"
        />
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
          {heroImages.map((url, idx) => {
            return (
              <Image
                key={url}
                src={url}
                alt={`Home Hero Image ${idx + 1}`}
                width={1000}
                height={500}
                loading="lazy"
              />
            );
          })}
        </Carousel>
        <ul className="my-6 flex w-full w-[80%] flex-wrap pl-0 md:my-12 md:w-[60%]">
          {!loadingCategories ? categories?.map((category) => {
            return (
              <li
                className="w-1/2 flex-auto p-2 text-center md:w-1/3 lg:w-1/4"
                key={category.id}
              >
                <FeatureLink
                  title={category.name}
                  href={`/products/listing#${category.name}`}
                  color="text-white-900"
                  backgroundColor="bg-gray-200"
                />
              </li>
            );
          }) : <Loader className='sticky mx-auto' />}
        </ul>
        <ProductSearchbar className="mb-6 md:mb-12" />
        <ProductCarousel
          showDescriptions={false}
          tag="BEST SELLERS"
          tagClassName="text-4xl"
          favorite={true}
        />
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
