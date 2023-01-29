import { useMemo } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import { PriceCell } from "@/components/atoms/table/PriceCell";
import type { TableCartItem } from "@/pages/cart";
import { Table } from "./table";

interface Props {
  tableItems: TableCartItem[];
  cartTotal: number;
}

export const CartItems = ({ tableItems, cartTotal }: Props) => {
  const cols = useMemo<ColumnDef<TableCartItem, string>[]>(
    () => [
      {
        cell: (row) => row.renderValue(),
        accessorKey: 'name',
        footer: 'Total',
      },
      {
        cell: (row) => <PriceCell<TableCartItem> price={row.renderValue()} />,
        accessorKey: 'price',
        footer: () => <PriceCell<TableCartItem> price={cartTotal.toString()} />,
      },
      {
        cell: (row) => row.renderValue(),
        accessorKey: 'quantity',
      }
    ],
    [cartTotal]
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
