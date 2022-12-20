import { useMemo } from 'react';

import type { CellContext, ColumnDef } from '@tanstack/react-table';
import type { Item as CartItem } from '@/store/cart';
import { useCartStore } from '@/store/cart';

import { useCartItems } from '../../lib/hooks/useCartItems';

import { Table } from '../../components/molecules/table';
import { Button } from '../../components/atoms/button';
import { Header } from '../../components/atoms/header';
import { Container } from '../../components/molecules/container';
import { Icon } from 'semantic-ui-react';

export type TableItem = Pick<CartItem, 'name' | 'price' | 'quantity' | 'id'>;

const Cart = () => {
  const { cartItems, cartTotal } = useCartItems();
  const { removeFromCart } = useCartStore();

  const tableItems: TableItem[] = Object.values(cartItems).map(({ name, price, quantity, id }) => ({
    name,
    price,
    quantity,
    cartTotal,
    id,
  }));

  const cols = useMemo<ColumnDef<TableItem, string>[]>(
    () => [
      {
        header: 'Name',
        cell: (row) => row.renderValue(),
        accessorKey: 'name',
        footer: 'Total',
      },
      {
        header: 'Price',
        cell: (row) => row.renderValue(),
        accessorKey: 'price',
        footer: () => cartTotal,
      },
      {
        header: 'Quantity',
        cell: (row) => row.renderValue(),
        accessorKey: 'quantity',
      },
      {
        header: '',
        cell: (row) => {
          // TODO: fix type error - if I define this function outside in its own scope, wrapping
          // with useMemo I'd get a type error:
          // '(row: CellContext<TableItem, string>) => JSX.Element' is not assignable to parameter of type '() => Element'.
          const handleRemove = () => {
            const id = row.getValue();
            removeFromCart(id);
          };

          return (
            <div className="flex justify-center">
              <span className="mr-5 cursor-pointer" onClick={handleRemove}>
                <Icon name="trash" />
              </span>
            </div>
          );
        },
        accessorKey: 'id',
      },
    ],
    [cartTotal, removeFromCart]
  );

  return (
    <Container>
      <Header extraClassName="text-center">Cart Items</Header>
      <Table data={tableItems} columns={cols} showGlobalFilter showNavigation={false} />
      <div className="mt-5 flex justify-center">
        <Button variant="link" href="/" extraClassName="mr-5">
          Go Back
        </Button>
        <Button variant="link" href="/checkout" extraClassName="ml-5">
          Checkout
        </Button>
      </div>
    </Container>
  );
};

export default Cart;
