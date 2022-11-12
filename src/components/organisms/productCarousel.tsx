import { useState } from 'react';
import { trpc } from '../../utils/trpc';

import { ProductCard } from '../molecules/productCard';
import { Button } from '../atoms/button';

type Props = {
  categoryId?: number;
  categoryName?: number;
};

export const ProductCarousel = ({ categoryId, categoryName }: Props) => {
  const [page, setPage] = useState(0);

  const { data, fetchNextPage } = trpc.product.getBatch.useInfiniteQuery(
    {
      // todo: make this limit depending on the screen size
      limit: 5,
      categoryId,
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
  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-gray-700">{categoryName ?? 'Products'}</h2>
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
      <Button variant="primary" extraClassName="mt-2" onClick={handleFetchNextPage}>
        More
      </Button>
      {page > 0 && (
        <Button variant="primary" extraClassName="mt-2" onClick={handleFetchPreviousPage}>
          Previous
        </Button>
      )}
    </div>
  );
};
