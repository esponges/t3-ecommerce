/* eslint-disable react/display-name */
import { useCallback, useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import { trpc } from '@/lib/trpc';

import { Table } from '@/components/molecules/table';

import type { Product, ProductTableItem as TableItem } from '@/types';
import { useDeviceWidth } from '@/lib/hooks/useDeviceWidth';
import { PageContainer } from '@/components/layouts/pageContainer';
import { ProductDetailsCell } from '../atoms/table/ProductDetailsCell';

interface Props {
  productsUrl?: string;
}

export const ProductsTable = ({ productsUrl }: Props) => {
  const { data } = trpc.product.getAll.useQuery(
    {},
    {
      // we  use useCallback since we want to memoize the selector
      // select is a fn, not a value, so useMemo won't work
      select: useCallback(
        (products: Product[]) =>
          products.map((product) => ({
            name: product.name,
            price: product.price,
            category: product.category.name,
          })),
        []
      ),
    }
  );

  const { isMobile } = useDeviceWidth();

  const cols = useMemo<ColumnDef<TableItem, string>[]>(
    () => [
      {
        header: 'Producto',
        cell: (row) => <ProductDetailsCell<TableItem> row={row} baseUrl={productsUrl} />,
        accessorKey: 'name',
        size: isMobile ? 250 : undefined,
        minSize: !isMobile ? 350 : undefined,
      },
      {
        header: 'Precio',
        cell: (row) => row.getValue(),
        accessorKey: 'price',
        size: 100,
      },
      {
        header: 'Categoría',
        cell: (row) => row.getValue(),
        accessorKey: 'category',
        size: 200,
      },
    ],
    [isMobile, productsUrl]
  );

  return (
    <>
      <PageContainer heading={{ title: 'Nuestros Productos' }} className="text-center">
        {data && data.length > 0 ? (
          <Table data={data as TableItem[]} columns={cols} isMobile={isMobile} showGlobalFilter />
        ) : null}
      </PageContainer>
    </>
  );
};

