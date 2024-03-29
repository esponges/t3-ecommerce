/* eslint-disable react/display-name */
import { useEffect, useMemo } from 'react';
import {
  Icon,
  Message,
  Button as SemanticButton
} from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Head from 'next/head';

import type { CellContext, ColumnDef } from '@tanstack/react-table';
import type { Item as CartItem, CartState } from '@/store/cart';
import { useCartActions } from '@/store/cart';

import { Table } from '@/components/molecules/table';
import { Button } from '@/components/atoms/button';
import { PriceCell } from '@/components/atoms/table/PriceCell';

import { useCartItems } from '@/lib/hooks/useCartItems';
import { PageRoutes } from '@/lib/routes';

import { trpc } from '@/lib/trpc';
import { PageContainer } from '@/components/layouts/pageContainer';
import { ProductDetailsCell } from '@/components/atoms/table/ProductDetailsCell';
import { Image } from '@/components/atoms/image';
import { useDeviceWidth } from '@/lib/hooks/useDeviceWidth';

export type TableCartItem = Pick<CartItem, 'name' | 'price' | 'quantity' | 'id'>;
type TableCartItemWithImage = TableCartItem & { image: string };

// if any min purchase add it here
export const MIN_PURCHASE = 0;

export default function Cart() {
  const { isMobile } = useDeviceWidth();
  const { cartItems, cartTotal } = useCartItems();
  const { removeFromCart, updateCartItems, increaseQuantity } = useCartActions();
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

    // TODO: in the future we'd like to show a warning and update with latest instead of removing the items
    if (!!noStockIds.length) {
      noStockIds.forEach((id) => {
        removeFromCart(id);
      });
      toast('Some products were removed due to stock changes', {
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
    return (
      removeFn: (id: string) => void,
      row: CellContext<TableCartItemWithImage, string>,
      addFn: CartState['actions']['increaseQuantity']
    ) => {
      const id = row.getValue();

      const handleRemove = () => {
        removeFn(id);
      };

      const handleAddOne = () => {
        addFn(id, 1);
      };

      return (
        <div className="text grid">
          <span
            className="mb-2 cursor-pointer"
            onClick={handleRemove}
          >
            <SemanticButton icon>
              <Icon name="trash" />
            </SemanticButton>
          </span>
          {/* add one extra */}
          <span
            className="cursor-pointer"
            onClick={handleAddOne}
          >
            <SemanticButton icon>
              <Icon name="plus" /> <span className="ml-1">1</span>
            </SemanticButton>
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
        header: '',
        cell: (row) =>
          !isMobile ? (
            <Image
              src={row.renderValue() || ''}
              alt={row.row.original.name}
            />
          ) : (
            ''
          ),
        accessorKey: 'image',
        size: !isMobile ? 100 : 0,
      },
      {
        header: 'Product',
        cell: (row) => <ProductDetailsCell<TableCartItemWithImage> row={row} />,
        accessorKey: 'name',
        footer: 'Total',
        minSize: !isMobile ? 350 : undefined,
      },
      {
        header: 'Price',
        cell: (row) => <PriceCell<TableCartItemWithImage> price={row.renderValue()} />,
        accessorKey: 'price',
        size: 120,
        footer: () => <PriceCell<TableCartItemWithImage> price={cartTotal.toString()} />,
      },
      {
        header: 'Quantity',
        cell: (row) => row.renderValue(),
        accessorKey: 'quantity',
        size: 50,
      },
      {
        header: '',
        cell: (row) => renderActions(removeFromCart, row, increaseQuantity),
        accessorKey: 'id',
        size: 75,
      },
    ],
    [cartTotal, removeFromCart, renderActions, isMobile, increaseQuantity]
  );

  return (
    <PageContainer
      verticallyCentered
      heading={{ title: 'Your Cart' }}
    >
      <Head>
        {/* dont index */}
        <meta
          name="robots"
          content="noindex"
        />
        <title>Cart</title>
      </Head>
      {tableItems.length ? (
        <Table
          data={tableItems}
          columns={cols}
          showNavigation={false}
        />
      ) : (
        <Message
          icon="shopping cart"
          header="Your cart is empty"
          size="big"
          content="Add some products to your cart to continue"
          data-testid="empty-cart-message"
        />
      )}
      <div className={`${!hasMinPurchase ? 'block text-center md:mx-auto md:w-1/2' : 'flex justify-center '} mb-4`}>
        {hasMinPurchase ? (
          <Button
            variant="primary"
            onClick={handleCheckout}
            className="mr-2"
          >
            Continue
          </Button>
        ) : (
          !!tableItems.length && (
            <Message
              icon="info circle"
              header="Minimum purchase not reached"
              content={`To continue, please spend at least $${MIN_PURCHASE}`}
            />
          )
        )}
        <Button
          variant="link"
          onClick={handleBack}
          className="ml-2"
        >
          Go Back
        </Button>
      </div>
    </PageContainer>
  );
}
