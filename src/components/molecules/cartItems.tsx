import { useMemo } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import { PriceCell } from "@/components/atoms/table/PriceCell";
import type { TableCartItem } from "@/pages/cart";
import { Table } from "./table";
import { useDeviceWidth } from "@/lib/hooks/useDeviceWidth";

interface Props {
  tableItems: TableCartItem[];
  cartTotal: number;
}

export const CartItems = ({ tableItems, cartTotal }: Props) => {
  const { isMobile } = useDeviceWidth();

  const cols = useMemo<ColumnDef<TableCartItem, string>[]>(
    () => [
      {
        header: 'Producto',
        cell: (row) => row.renderValue(),
        accessorKey: 'name',
        footer: 'Total',
        maxSize: isMobile ? 250 : undefined,
        minSize: isMobile ? 250 : 300,
      },
      {
        header: 'Precio',
        cell: (row) => <PriceCell<TableCartItem> price={row.renderValue()} />,
        accessorKey: 'price',
        footer: () => <PriceCell<TableCartItem> price={cartTotal.toString()} />,
      },
      {
        header: 'Cantidad',
        cell: (row) => row.renderValue(),
        accessorKey: 'quantity',
      }
    ],
    [cartTotal, isMobile]
  );

  return (
    <Table
      columns={cols}
      data={tableItems}
      showGlobalFilter={false}
      showNavigation={false}
    />
  );
};
