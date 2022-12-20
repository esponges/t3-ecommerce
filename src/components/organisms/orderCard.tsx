import { useMemo } from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import type { OrderDetails } from '@/types';

import { getOrderTotal } from '@/lib/order';

import { Table } from '@/components/molecules/table';

interface Props {
  order: OrderDetails;
}

export const OrderCard = ({ order }: Props) => {
  const products = order.orderItems.map((item) => ({ ...item.product, qty: item.quantity }));
  const total = getOrderTotal(products);

  const columns = useMemo<ColumnDef<typeof products[0]>[]>(
    () => [
      {
        header: 'Name',
        cell: (row) => row.renderValue(),
        accessorKey: 'name',
        footer: () => 'Total',
      },
      {
        header: 'Price',
        cell: (row) => row.renderValue(),
        accessorKey: 'price',
        footer: () => total,
      },
      {
        header: 'Quantity',
        cell: (row) => row.renderValue(),
        accessorKey: 'qty',
      },
    ],
    [total]
  );

  return (
    <div className="my-2 rounded-lg bg-white p-4 shadow-md">
      <div className="flex justify-between">
        <p className="text-gray-500">Order ID: {order.id}</p>
      </div>
      <div className="flex justify-between">
        <p className="text-gray-500">Date: {order.createdAt.toLocaleDateString()}</p>
        <p className="text-gray-500">Total: {total}</p>
      </div>
      <div className="w-full">
        <Table data={products} columns={columns} showNavigation={false} />
      </div>
    </div>
  );
};
