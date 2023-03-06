/* eslint-disable react/display-name */
import Head from "next/head";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/router";

import { CartItemsTable } from "@/components/molecules/cartItemsTable";
import { PageContainer } from "@/components/layouts/pageContainer";
import { Loader } from "@/components/molecules/loader";
import { Table } from "@/components/molecules/table";
import { Modal } from "@/components/organisms/modals/modal";

import { trpc } from "@/lib/trpc";

import type { OrderWithOptPayload } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";


type TableOrderItem = OrderWithOptPayload<false, false, false>;
type OrderDetails = OrderWithOptPayload<true, true, true>;

export default function AdminOrders () {
  const router = useRouter();
  const { orderId } = router.query;

  const { data: orders, isLoading } = trpc.order.get.useQuery({}, {
    select: (orderItems: TableOrderItem[]) => orderItems.map((order) => ({
      id: order.id,
      createdAt: order.createdAt,
      total: order.total,
    }))
  });
  const { data: selectedOrder } = trpc.order.getById.useQuery({
    id: orderId as string,
  }, {
    enabled: !!orderId,
    select: useCallback((o:OrderDetails) => {
      return {
        ...o,
        orderItems: o.orderItems.map((orderItem) => ({
          id: orderItem.product.id,
          name: orderItem.product.name,
          price: orderItem.product.price,
          quantity: orderItem.quantity,
        })),
      };
    }, []),
  });

  const handleOrderClick = useCallback((id: string) => {
    // add orderId to url params
    router.push({
      pathname: '/dashboard/orders',
      query: { orderId: id },
    });
  }, [router]);

  const handleModalClose = () => {
    // remove orderId from url params
    router.push({
      pathname: '/dashboard/orders',
    });
  };

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
          <Modal
            open={!!selectedOrder}
            onClose={handleModalClose}
            title={`Detalles de la orden ${selectedOrder?.id ?? ''}`}
          >
            <div className="flex flex-col md:mx-2">
              <div className="flex flex-col md:flex-row">
                <div className="flex flex-col w-full md:w-1/2">
                  <div className="flex flex-col">
                    <span className="font-bold">Nombre:</span>
                    <span>{selectedOrder?.orderDetail?.name || selectedOrder?.user?.name}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold">Email:</span>
                    <span>{selectedOrder?.orderDetail?.email || selectedOrder?.user?.email || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold">Teléfono:</span>
                    <span>{selectedOrder?.orderDetail?.phone || 'N/A'}</span>
                  </div>
                </div>
                <div className="flex flex-col w-full md:w-1/2">
                  <div className="flex flex-col">
                    <span className="font-bold">Dirección:</span>
                    <span>{selectedOrder?.orderDetail?.address || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold">Horario:</span>
                    <span>{selectedOrder?.orderDetail?.schedule || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold">Pago:</span>
                    <span>{selectedOrder?.orderDetail?.payment || 'N/A'}</span>
                  </div>
                </div>
              </div>
              {selectedOrder && selectedOrder.orderItems && (
                <CartItemsTable
                  tableItems={selectedOrder.orderItems}
                  cartTotal={selectedOrder.total}
                />
              )}
            </div>
          </Modal>
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
