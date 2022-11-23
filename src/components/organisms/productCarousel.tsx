import { useState } from 'react';
import type { Category, Product } from '@prisma/client';
import { trpc } from '../../utils/trpc';

import { ProductCard } from '../molecules/productCard';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useDeviceWidth } from '../../lib/hooks/useDeviceWidth';
import { carrouselStyle, itemsPerCarrousel } from '../../lib/products';

type Props = {
  category?: Category;
  extraClassName?: string;
};

export const ProductCarousel = ({ category, extraClassName }: Props) => {
  const router = useRouter();
  const [page, setPage] = useState(0);

  const { screen } = useDeviceWidth();

  const className = carrouselStyle(screen);

  const limit = itemsPerCarrousel(screen);
  const { data, fetchNextPage } = trpc.product.getBatch.useInfiniteQuery(
    {
      // todo: make this limit depending on the screen size
      limit,
      categoryId: category?.id,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const handleFetchNextPage = () => {
    fetchNextPage();
    setPage((prev) => prev + 1);
  };

  const handleFetchPreviousPage = () => {
    setPage((prev) => prev - 1);
  };

  const handleCardClick = (id: Product['id']) => {
    router.push(`/product/${id}`);
  };

  const toShow = data?.pages[page]?.items;
  // figure out last page
  const nextCursor = data?.pages[page]?.nextCursor;

  return (
    <div
      className={`relative mt-6 flex flex-col items-center justify-center md:px-12 ${className.wrapper} ${
        extraClassName ?? ''
      }`}
    >
      <h2 className="text-2xl font-bold text-gray-700">{category?.name ?? 'Products'}</h2>
      <div className="relative flex mt-2">
        {toShow?.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            image={product.image}
            description={product.description}
            price={product.price}
            id={product.id}
            onClick={() => handleCardClick(product.id)}
          />
        ))}
        {nextCursor && (
          <button
            className="carousel-control-next absolute top-0 bottom-0 right-0 
                flex items-center justify-center border-0 p-0 text-center 
                hover:no-underline hover:outline-none focus:no-underline focus:outline-none"
            type="button"
            onClick={handleFetchNextPage}
          >
            <Image src="/arrow_forward.svg" width={50} height={50} layout="fixed" alt="next" />
          </button>
        )}
        {page > 0 && (
          <button
            className="carousel-control-prev absolute top-0 bottom-0 left-0 
                flex items-center justify-center border-0 p-0 text-center 
                hover:no-underline hover:outline-none focus:no-underline focus:outline-none"
            type="button"
            onClick={handleFetchPreviousPage}
          >
            <Image src="/arrow_back.svg" width={50} height={50} layout="fixed" alt="next" />
          </button>
        )}
      </div>
    </div>
  );
};
