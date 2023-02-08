import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import type { OrderDetails } from '@/types';
import { getOrderTotal } from '@/lib/order';
import { Table } from '@/components/molecules/table';
import { useDeviceWidth } from '@/lib/hooks/useDeviceWidth';

interface Props {
  order: OrderDetails;
}

export const OrderCard = ({ order }: Props) => {
  const products = order.orderItems.map((item) => ({ ...item.product, qty: item.quantity }));
  const total = getOrderTotal(products);

  const { isMobile } = useDeviceWidth(); 

  const columns = useMemo<ColumnDef<typeof products[0]>[]>(
    () => [
      {
        header: 'Nombre',
        cell: (row) => row.renderValue(),
        accessorKey: 'name',
        footer: () => 'Total',
        maxSize: isMobile ? 250 : undefined,
        minSize: isMobile ? 250 : 300,
      },
      {
        header: 'Precio',
        cell: (row) => row.renderValue(),
        accessorKey: 'price',
        footer: () => total,
      },
      {
        header: 'Cantidad',
        cell: (row) => row.renderValue(),
        accessorKey: 'qty',
      },
    ],
    [total, isMobile]
  );

  return (
    <div className="my-2 rounded-lg bg-white p-4 shadow-md">
      <div className="flex justify-between">
        <p className="text-gray-500">ID: {order.id}</p>
      </div>
      <div className="flex justify-between">
        <p className="text-gray-500">Fecha: {order.createdAt.toLocaleDateString()}</p>
        <p className="text-gray-500">Total: {total}</p>
      </div>
      <div className="w-full">
        <Table data={products} columns={columns} showNavigation={false} />
      </div>
    </div>
  );
};
