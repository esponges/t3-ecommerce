import { PageRoutes, getProductDetailsRoute } from '@/lib/routes';
import type { CellContext } from '@tanstack/react-table';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';

interface Props<T> {
  row: CellContext<T, string>;
  imageUrl?: string;
  baseUrl?: string;
  fullUrl?: string;
}

export const ProductDetailsCell = <T,>({ row, imageUrl, baseUrl, fullUrl }: Props<T>) => {
  return useMemo(() => {
    const value = row.getValue();
    return (
      <div className="flex items-center space-x-4">
        {imageUrl ? (
          <div className="w-20 h-20 relative">
            <Image
              src={imageUrl ?? '/images/placeholder.png'}
              alt={value}
              layout="fill"
              objectFit="contain"
            />
          </div>
        ) : null}
        <Link href={fullUrl || baseUrl || getProductDetailsRoute(PageRoutes.Products, value)}>{value}</Link>
      </div>
    );
  }, [row, imageUrl, baseUrl, fullUrl]);
};
