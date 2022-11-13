import { useState } from 'react';
import { trpc } from '../../utils/trpc';

import { ProductCard } from '../molecules/productCard';
import { Button } from '../atoms/button';
import { Category } from '@prisma/client';

type Props = {
  category?: Category;
};

export const ProductCarousel = ({ category }: Props) => {
  const [page, setPage] = useState(0);

  const { data, fetchNextPage } = trpc.product.getBatch.useInfiniteQuery(
    {
      // todo: make this limit depending on the screen size
      limit: 5,
      categoryId: category?.id
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
    <div className="flex flex-col items-center justify-center">
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
        <Button variant="primary" extraClassName="mt-2" onClick={handleFetchNextPage}>
          More
        </Button>
      )}
      {page > 0 && (
        <Button variant="primary" extraClassName="mt-2" onClick={handleFetchPreviousPage}>
          Previous
        </Button>
      )}
    </div>
  );
};