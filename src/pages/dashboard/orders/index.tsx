import { trpc } from "@/lib/trpc";
import Head from "next/head";
import { PageContainer } from "@/components/layouts/pageContainer";
import { Loader } from "@/components/molecules/loader";
import { Table } from "@/components/molecules/table";

import type { OrderWithOptPayload } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

type TableOrderItem = OrderWithOptPayload<false, false, false>;

export default function AdminOrders () {
  const { data: orders, isLoading } = trpc.order.get.useQuery({}, {
    select: (orderItems: TableOrderItem[]) => orderItems.map((order) => ({
      id: order.id,
      createdAt: order.createdAt,
      total: order.total,
    }))
  });

  const cols = useMemo<ColumnDef<TableOrderItem, string>[]>(
    () => [
      {
        header: 'id',
        accessorKey: 'id',
        cell: (row) => row.renderValue(),
      },
      {
        header: 'Fecha',
        accessorKey: 'createdAt',
        // cell: (row) => row.renderValue(),
      },
      {
        header: 'Total',
        accessorKey: 'total',
        cell: (row) => row.renderValue(),
        size: 50,
      },
    ],
    []
  );

  return (
    <PageContainer heading={{ title: 'Información de tu cuenta' }} className="text-center">
      <Head>
        {/* dont index */}
        <meta name="robots" content="noindex" />
        <title>Tu cuenta</title>
      </Head>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Table
            columns={cols}
            data={orders as TableOrderItem[]}
            showGlobalFilter={true}
            showNavigation={true}
          />
        </>
      )}
    </PageContainer>
  );
}
