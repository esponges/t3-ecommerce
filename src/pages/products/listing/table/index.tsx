/* eslint-disable react/display-name */
import { useMemo } from 'react';
import Head from 'next/head';
import superjson from 'superjson';
import type { ColumnDef, CellContext } from '@tanstack/react-table';
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import Link from 'next/link';

import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { appRouter } from '@/server/trpc/router';
import { trpc } from '@/utils/trpc';
import { createContext } from '@/server/trpc/context';

import { Container } from '@/components/molecules/container';
import { Header } from '@/components/atoms/header';
import { Table } from '@/components/molecules/table';

import type { Product } from '@/types';
import { PageRoutes } from '@/lib/routes';

// consider that the Category will only return a name
type TableItem = Product & { category: string };

const ProductTable = () => {
  const { data } = trpc.product.getAll.useQuery();

  const tableItems = useMemo(() => {
    return data?.map((product) => ({
      name: product.name,
      price: product.price,
      category: product.category.name,
    })) as TableItem[];
  }, [data]);

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
        header: 'Name',
        cell: (row) => renderProductLink(row),
        accessorKey: 'name',
      },
      {
        header: 'Price',
        cell: (row) => row.getValue(),
        accessorKey: 'price',
      },
      {
        header: 'Category',
        cell: (row) => row.getValue(),
        accessorKey: 'category'
      },
    ],
    [renderProductLink]
  );

  return (
    <>
      <Container>
        <Head>
          <title>List</title>
          <meta name="description" content="All our available products" />
        </Head>
        <Header>Products</Header>
        <Table data={tableItems} columns={cols} />
      </Container>
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

  await ssg.product.getAll.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};
