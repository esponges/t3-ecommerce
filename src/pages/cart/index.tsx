import { useMemo } from 'react';
import Link from 'next/link';

import type { ColumnDef } from '@tanstack/react-table';

import { Table } from '../../components/molecules/table';
import { useCartItems } from '../../lib/hooks/useCartItems';
import type { Item as CartItem } from '../../store/cart';

export type TableItem = Pick<CartItem, 'name' | 'price' | 'quantity'>;

const Cart = () => {
  const { cartItems, cartTotal } = useCartItems();

  const tableItems: TableItem[] = Object.values(cartItems).map(({ name, price, quantity }) => ({
    name,
    price,
    quantity,
  }));

  const cols = useMemo<ColumnDef<TableItem>[]>(
    () => [
      {
        header: 'Name',
        cell: (row) => row.renderValue(),
        accessorKey: 'name',
      },
      {
        header: 'Price',
        cell: (row) => row.renderValue(),
        accessorKey: 'price',
      },
      {
        header: 'Quantity',
        cell: (row) => row.renderValue(),
        accessorKey: 'quantity',
      },
    ],
    []
  );

  return (
    <div className="px-10 py-5">
      <h1>Cart</h1>
      <Table
        data={tableItems}
        columns={cols}
      />
      <ul>
        {Object.entries(cartItems).map(([id, item]) => (
          <li key={id}>
            {item.name} - {item.price} - {item.quantity}
          </li>
        ))}
      </ul>
      <div>Total price: ${cartTotal}</div>
      <div className="mt-10">
        <Link href="/checkout">
          {/* to do: don't allow non auth users to
          go to the checkout, make them login and 
          then redirect them after login */}
          <a>Go to checkout</a>
        </Link>
      </div>
      <div className="mt-5">
        <Link href="/">
          <a>Go back</a>
        </Link>
      </div>
    </div>
  );
};

export default Cart;
