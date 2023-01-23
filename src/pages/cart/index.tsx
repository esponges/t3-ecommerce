/* eslint-disable react/display-name */
import { useMemo } from 'react';
import { Icon } from 'semantic-ui-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

import type { CellContext, ColumnDef } from '@tanstack/react-table';
import type { Item as CartItem } from '@/store/cart';
import { useCartActions } from '@/store/cart';

import { useCartItems } from '@/lib/hooks/useCartItems';

import { Table } from '@/components/molecules/table';
import { Button } from '@/components/atoms/button';
import { Header } from '@/components/atoms/header';
import { Container } from '@/components/molecules/container';
import { PageRoutes } from '@/lib/routes';
import { PriceCell } from '@/components/atoms/table/PriceCell';

type TableItem = Pick<CartItem, 'name' | 'price' | 'quantity' | 'id'>;

const Cart = () => {
  // todo: atm cart items are stored in local storage, so they are kept even if the user logs out
  // however the prices are not updated, so the user can buy products at a lower price
  // we should either update the prices or remove the items from the cart when the user logs out
  const { cartItems, cartTotal } = useCartItems();
  const { removeFromCart } = useCartActions();
  const router = useRouter(); useRouter

  const tableItems: TableItem[] = Object.values(cartItems).map(({ name, price, quantity, id }) => ({
    name,
    price,
    quantity,
    cartTotal,
    id,
  }));

  const renderActions = useMemo(() => {
    // use memo doesn't take arguments, only if it returns a function as a closure
    return (removeFn: (id: string) => void, row: CellContext<TableItem, string>) => {
      const handleRemove = () => {
        const id = row.getValue();
        removeFn(id);
      };

      return (
        <div className="flex justify-center">
          <span className="mr-5 cursor-pointer" onClick={handleRemove}>
            <Icon name="trash" />
          </span>
        </div>
      );
    };
  }, []);

  const renderProductLink = useMemo(() => {
    return (row: CellContext<TableItem, string>) => {
      const name = row.getValue();

      return <Link href={`${PageRoutes.Products}/${name}`}>{name}</Link>;
    };
  }, []);

  const minPurchase = 1500;
  const hasMinPurchase = cartTotal >= minPurchase;

  const showCompleteMinPurchaseToast = () => {
    return toast(`Please spend at least $${minPurchase} to complete your order`, {
      type: 'error',
    });
  };
  
  const handleCheckout = () => {
    if (!hasMinPurchase) {
      return showCompleteMinPurchaseToast();
    }
    router.push(PageRoutes.Checkout);
  };

  const cols = useMemo<ColumnDef<TableItem, string>[]>(
    () => [
      {
        header: 'Producto',
        cell: (row) => renderProductLink(row),
        accessorKey: 'name',
        footer: 'Total',
      },
      {
        header: 'Precio',
        cell: (row) => <PriceCell<TableItem> price={row.renderValue()} />,
        accessorKey: 'price',
        footer: () => <PriceCell<TableItem> price={cartTotal.toString()} />,
      },
      {
        header: 'Cantidad',
        cell: (row) => row.renderValue(),
        accessorKey: 'quantity',
      },
      {
        header: '',
        cell: (row) => renderActions(removeFromCart, row),
        accessorKey: 'id',
      },
    ],
    [cartTotal, removeFromCart, renderActions, renderProductLink]
  );

  return (
    <Container>
      <Header extraClassName="text-center">Cart Items</Header>
      <Table data={tableItems} columns={cols} showGlobalFilter showNavigation={false} />
      <div className="mt-5 flex justify-center">
        <Button variant="link" href="/" extraClassName="mr-5">
          Go Back
        </Button>
        <Button variant='link' onClick={handleCheckout} extraClassName="ml-5">
          Checkout
        </Button>
      </div>
    </Container>
  );
};

export default Cart;
