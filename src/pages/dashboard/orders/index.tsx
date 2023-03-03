/* eslint-disable react/display-name */
import { trpc } from "@/lib/trpc";
import Head from "next/head";
import { PageContainer } from "@/components/layouts/pageContainer";
import { Loader } from "@/components/molecules/loader";
import { Table } from "@/components/molecules/table";

import type { OrderWithOptPayload } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/router";

type TableOrderItem = OrderWithOptPayload<false, false, false>;

export default function AdminOrders () {
  const router = useRouter();

  const { data: orders, isLoading } = trpc.order.get.useQuery({}, {
    select: (orderItems: TableOrderItem[]) => orderItems.map((order) => ({
      id: order.id,
      createdAt: order.createdAt,
      total: order.total,
    }))
  });

  const handleOrderClick = useCallback((id: string) => {
    // add orderId to url params
    router.push({
      pathname: '/dashboard/orders',
      query: { orderId: id },
    });
  }, [router]);

  const renderDetailCell = useMemo(() => {
    return (id?: string|null) => {
      return (
        <button
          className="text-blue-500 hover:text-blue-700"
          onClick={() => handleOrderClick(id ?? '')}
        >
          {id ?? ''}
        </button>
      );
    };
  }, [handleOrderClick]);

  const cols = useMemo<ColumnDef<TableOrderItem, string>[]>(
    () => [
      {
        header: 'id',
        accessorKey: 'id',
        cell: (row) => renderDetailCell(row.renderValue()),
      },
      {
        header: 'Fecha',
        accessorKey: 'createdAt',
      },
      {
        header: 'Total',
        accessorKey: 'total',
        cell: (row) => row.renderValue(),
        size: 50,
      },
    ],
    [renderDetailCell]
  );

  return (
    <PageContainer heading={{ title: 'Órdenes' }} className="text-center">
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

AdminOrders.requireAuth = true;
AdminOrders.requireAdmin = true;
