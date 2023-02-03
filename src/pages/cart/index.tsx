/* eslint-disable react/display-name */
import { useEffect, useMemo } from 'react';
import { Icon, Message } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

import type { CellContext, ColumnDef } from '@tanstack/react-table';
import type { Item as CartItem } from '@/store/cart';
import { useCartActions } from '@/store/cart';

import { Table } from '@/components/molecules/table';
import { Button } from '@/components/atoms/button';
import { PriceCell } from '@/components/atoms/table/PriceCell';

import { useCartItems } from '@/lib/hooks/useCartItems';
import { PageRoutes } from '@/lib/routes';

import { trpc } from '@/utils/trpc';
import { PageContainer } from '@/components/layouts/pageContainer';
import { ProductDetailsCell } from '@/components/atoms/table/ProductDetailsCell';

export type TableCartItem = Pick<CartItem, 'name' | 'price' | 'quantity' | 'id'>;
type TableCartItemWithImage = TableCartItem & { image: string };

// consider moving this to a constants file when there's one
export const MIN_PURCHASE = 1500;

const Cart = () => {
  const { cartItems, cartTotal } = useCartItems();
  const { removeFromCart, updateCartItems } = useCartActions();
  const router = useRouter();
  useRouter;

  const itemIds = Object.keys(cartItems);
  const { data } = trpc.product.getBatchByIds.useQuery({ productIds: itemIds });

  // figure out if there's been a price change
  const priceChangeIds = useMemo(() => {
    if (!data) return [];

    const ids: string[] = [];
    data.forEach((item) => {
      const { id, price } = item;
      const cartItem = cartItems[id];

      if (cartItem && cartItem.price !== price) {
        // the price has changed, add the id to the list
        ids.push(id);
      }
    });
    return ids;
  }, [data, cartItems]);

  const noStockIds = useMemo(() => {
    if (!data) return [];

    const ids: string[] = [];
    data.forEach((item) => {
      const { id, stock } = item;
      const cartItem = cartItems[id];

      if ((cartItem && cartItem.quantity > stock) || !stock) {
        ids.push(id);
      }
    });
    return ids;
  }, [data, cartItems]);

  // update the prices if there's been a price change
  useEffect(() => {
    if (!data || (!priceChangeIds.length && !noStockIds.length)) return;

    if (!!priceChangeIds.length) {
      // get the items that have changed
      const toUpdate = data.filter((item) => priceChangeIds.includes(item.id));
      // update the cart items
      updateCartItems(toUpdate);
    }

    // TODO: in the future we'd like to show a warning instead of removing the items
    if (!!noStockIds.length) {
      noStockIds.forEach((id) => {
        removeFromCart(id);
      });
      toast('Algunos productos fueron retirados de tu carrito por falta de stock', {
        type: 'error',
      });
    }
  }, [data, priceChangeIds, updateCartItems, noStockIds, removeFromCart]);

  const tableItems: TableCartItemWithImage[] = Object.values(cartItems).map(({ name, price, quantity, id, image }) => ({
    name,
    price,
    quantity,
    cartTotal,
    id,
    image,
  }));

  const renderActions = useMemo(() => {
    // use memo doesn't take arguments, only if it returns a function as a closure
    return (removeFn: (id: string) => void, row: CellContext<TableCartItemWithImage, string>) => {
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

  const hasMinPurchase = cartTotal >= MIN_PURCHASE;

  const showCompleteMinPurchaseToast = () => {
    return toast(`Please spend at least $${MIN_PURCHASE} to complete your order`, {
      type: 'error',
    });
  };

  const handleCheckout = () => {
    if (!hasMinPurchase) {
      return showCompleteMinPurchaseToast();
    }
    router.push(PageRoutes.Checkout);
  };

  const handleBack = () => {
    router.push(PageRoutes.List);
  };

  const cols = useMemo<ColumnDef<TableCartItemWithImage, string>[]>(
    () => [
      {
        header: 'Producto',
        cell: (row) => <ProductDetailsCell<TableCartItemWithImage> row={row} imageUrl={row.row.original.image} />,
        accessorKey: 'name',
        footer: 'Total',
      },
      {
        header: 'Precio',
        cell: (row) => <PriceCell<TableCartItemWithImage> price={row.renderValue()} />,
        accessorKey: 'price',
        footer: () => <PriceCell<TableCartItemWithImage> price={cartTotal.toString()} />,
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
    [cartTotal, removeFromCart, renderActions]
  );

  return (
    <PageContainer verticallyCentered header={{ title: 'Tu carrito' }}>
      <div className="my-15">
        {tableItems.length ? (
          <Table data={tableItems} columns={cols} showGlobalFilter={false} showNavigation={false} />
        ) : (
          <Message
            icon="shopping cart"
            header="Tu carrito está vacío"
            size="big"
            content="Agrega productos a tu carrito para continuar"
          />
        )}
      </div>
      <div className={`${!hasMinPurchase ? 'block text-center md:mx-auto md:w-1/2' : 'flex justify-center '}`}>
        {hasMinPurchase ? (
          <Button variant="link" onClick={handleCheckout} className="mr-2">
            Continuar
          </Button>
        ) : (
          !!tableItems.length && (
            <Message
              icon="info circle"
              header="Aún no puedes continuar"
              content={`Para continuar debes tener al menos $${MIN_PURCHASE} en el carrito`}
            />
          )
        )}
        <Button variant="link" onClick={handleBack} className="ml-2">
          Regresar
        </Button>
      </div>
    </PageContainer>
  );
};

export default Cart;
