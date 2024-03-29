import { useRouter } from 'next/router';
import { Card } from 'semantic-ui-react';

import type { Product } from '@prisma/client';

import { Button } from '@/components/atoms/button';
import { Image } from '@/components/atoms/image';
import { Counter } from '@/components/molecules/counter';
import { useProduct } from '@/lib/hooks/useProduct';
import { useCartActions } from '@/store/cart';
import { PageRoutes, getProductDetailsRoute } from '@/lib/routes';

type Props = {
  product?: Product;
  onClick?: () => void;
  onAddToCart?: (qty: number) => void;
  redirOnImageClick?: boolean;
  fullWidth?: boolean;
  showDetailsBtn?: boolean;
  showAddToCartBtn?: boolean;
  showDescription?: boolean;
  inline?: boolean;
  qty?: number;
};

export const ProductCard = ({
  product,
  /* onClick, */
  onAddToCart,
  fullWidth,
  inline,
  showDetailsBtn = true,
  showAddToCartBtn = true,
  showDescription = true,
  redirOnImageClick = true,
  qty,
}: Props) => {
  const router = useRouter();
  const { addToCart } = useCartActions();

  const handleAdd = (n: number) => {
    if (product && !onAddToCart) {
      addToCart(product, n);
      return;
    }

    if (onAddToCart) {
      onAddToCart(n);
    }
  };

  const { quantity, isAddingToCart, handleChangeProductQty, handleQtyInputChange, handleAddToCart } = useProduct({
    onAddToCart: handleAdd,
  });

  const handleDetailsClick = () => {
    if (product?.name) {
      void router.push(getProductDetailsRoute(PageRoutes.Products, product.name));
    }
  };

  return (
    <div className="card m-2">
      <Card>
        <div
          className="cursor-pointer"
          onClick={redirOnImageClick ? handleDetailsClick : undefined}
          data-testid="product-card-image"
        >
          <Image
            src={product?.image ?? '/images/empty-bottle.png'}
            alt="product"
            placeholder="blur"
            blurDataURL="/images/empty-bottle.png"
          />
        </div>
        <Card.Content onClick={redirOnImageClick ? handleDetailsClick : undefined}>
          <Card.Header className="cursor-pointer">{product?.name}</Card.Header>
          <Card.Meta>
            <span className="date text-gray-600">${product?.price} USD</span>
          </Card.Meta>
          {showDescription && <Card.Description className="h-20">{product?.description}</Card.Description>}
        </Card.Content>
        <Card.Content extra>
          <div className="flex justify-around text-center">
            <Counter
              onIncrease={handleChangeProductQty}
              onDecrease={handleChangeProductQty}
              onChange={handleQtyInputChange}
              count={qty ?? quantity}
              className="mr-2"
              id={product?.id || 'counter'}
            />
            <div>
              {showAddToCartBtn ? (
                <Button
                  onClick={handleAddToCart}
                  variant="primary"
                  className={`${inline ? 'mr-2' : ''}`}
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? 'Adding...' : fullWidth ? 'Add to cart' : 'Add'}
                </Button>
              ) : null}
              {showDetailsBtn ? (
                <Button
                  onClick={handleDetailsClick}
                  variant="primary"
                >
                  Details
                </Button>
              ) : null}
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};
