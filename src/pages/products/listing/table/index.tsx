/* eslint-disable react/display-name */
import { useCallback, useMemo } from 'react';
import Head from 'next/head';
import superjson from 'superjson';
import type { ColumnDef, CellContext } from '@tanstack/react-table';
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse
} from 'next'
import Link from 'next/link';

import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { appRouter } from '@/server/trpc/router';
import { trpc } from '@/utils/trpc';
import { createContext } from '@/server/trpc/context';

import { Table } from '@/components/molecules/table';

import type { Product } from '@/types';
import { PageRoutes } from '@/lib/routes';
import { useDeviceWidth } from '@/lib/hooks/useDeviceWidth';
import { PageContainer } from '@/components/layouts/pageContainer';

// consider that the Category will only return a name
type TableItem = Product & { category: string };

const ProductTable = () => {
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

  // const tableItems = data as TableItem[];

  // to do, create a reusable component for the renderers
  const renderProductLink = useMemo(() => {
    return (row: CellContext<TableItem, string>) => {
      const name = row.getValue();

      return <Link href={`${PageRoutes.Products}/${name}`}>{name}</Link>;
    };
  }, []);

  const cols = useMemo<ColumnDef<TableItem, string>[]>(
    () => [
      {
        header: 'Producto',
        cell: (row) => renderProductLink(row),
        accessorKey: 'name',
        size: isMobile ? 250 : undefined,
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
        maxSize: 200,
      },
    ],
    [renderProductLink, isMobile]
  );

  return (
    <>
      <Head>
        <title>Products</title>
        <meta name="description" content="Nuestra lista de productos completa" />
      </Head>
      <PageContainer header={{ title: 'Nuestros Productos' }} className="text-center">
        <Table data={data as TableItem[]} columns={cols} isMobile={isMobile} showGlobalFilter />
      </PageContainer>
    </>
  );
};

export default ProductTable;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext({ req: ctx.req as NextApiRequest, res: ctx.res as NextApiResponse }),
    transformer: superjson,
  });

  await ssg.product.getAll.prefetch({});

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};
