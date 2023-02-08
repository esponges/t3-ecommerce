import Image from 'next/image';
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
import { Pill } from '@/components/atoms/pill';

import { trpc } from '@/utils/trpc';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { appRouter } from '@/server/trpc/router';
import { createContext } from '@/server/trpc/context';


const heroImages = [
  '/images/hero/hero-image-1.jpeg',
  '/images/hero/hero-image-2.jpeg',
  '/images/hero/hero-image-3.jpeg',
];

const Home = () => {
  const { data: categories } = trpc.category.getAll.useQuery();

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
        {/* <HeroCarousel /> */}
        <ul className="my-6 flex w-full flex-wrap pl-0 md:my-12 w-[80%] md:w-[60%]">
          {categories?.map((category) => {
            return (
              <li className="flex-auto text-center" key={category.id}>
                <Pill
                  href={`/products/listing#${category.name}`}
                  roundedStyle="rounded-md"
                  className="m-1 bg-primary-blue text-xl md:m-2"
                  textClassName='text-white'
                >
                  {category.name}
                </Pill>
              </li>
            );
          })}
        </ul>
        <h3 className="mt-6 text-xl font-bold text-gray-700">¿Estás buscando algo?</h3>
        <ProductSearchbar className="mb-6 md:mb-12" />
        <ProductCarousel showDescriptions={false} tag="Los Más Vendidos" tagClassName="text-4xl" favorite={true} />
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
