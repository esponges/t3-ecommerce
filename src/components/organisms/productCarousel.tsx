import { useState } from 'react';
import { Category } from '@prisma/client';
import { trpc } from '../../utils/trpc';

import { ProductCard } from '../molecules/productCard';

type Props = {
  category?: Category;
};

export const ProductCarousel = ({ category }: Props) => {
  const [page, setPage] = useState(0);

  const { data, fetchNextPage } = trpc.product.getBatch.useInfiniteQuery(
    {
      // todo: make this limit depending on the screen size
      limit: 5,
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

  const toShow = data?.pages[page]?.items;
  // figure out last page
  const nextCursor = data?.pages[page]?.nextCursor;

  return (
    <div className="relative flex flex-col items-center justify-center px-7">
      <h2 className="text-2xl font-bold text-gray-700">{category?.name ?? 'Products'}</h2>
      <div className="mt-4 flex flex-row gap-4">
        {toShow?.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            image={product.image}
            description={product.description}
            price={product.price}
          />
        ))}
      </div>
      {nextCursor && (
        <button
          className="carousel-control-next absolute top-0 bottom-0 right-0 
              flex items-center justify-center border-0 p-0 text-center 
              hover:no-underline hover:outline-none focus:no-underline focus:outline-none"
          type="button"
          onClick={handleFetchNextPage}
        >
          <span>{' > '}</span>
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
          <span>{' < '}</span>
        </button>
      )}
    </div>
  );
};
