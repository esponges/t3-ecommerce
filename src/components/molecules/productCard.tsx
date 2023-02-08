import { useRouter } from 'next/router';
import { Card } from 'semantic-ui-react';

import type { Product } from '@prisma/client';

import { Button } from '@/components/atoms/button';
import { Counter } from '@/components/molecules/counter';
import { useProduct } from '@/lib/hooks/useProduct';
import { useCartActions } from '@/store/cart';
import Image from 'next/image';
import { PageRoutes } from '@/lib/routes';

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

  const handleAdd = (qty: number) => {
    if (product && !onAddToCart) {
      addToCart(product, qty);
      return;
    }

    if (onAddToCart) {
      onAddToCart(qty);
    }
  };

  const { quantity, isAddingToCart, handleChangeProductQty, handleQtyInputChange, handleAddToCart } = useProduct({
    onAddToCart: handleAdd,
  });

  const handleDetailsClick = () => {
    if (product?.name) {
      void router.push(`${PageRoutes.Products}/${product?.name}`);
    }
  };

  return (
    <div className="card m-2">
      <Card>
        <div className="cursor-pointer" onClick={redirOnImageClick ? handleDetailsClick : undefined}>
          <Image
            src={product?.image ?? '/images/empty-bottle.png'}
            alt="product"
            className="w-full"
            placeholder="blur"
            blurDataURL="/images/empty-bottle.png"
            width={300}
            height={300}
          />
        </div>
        <Card.Content>
          <Card.Header className="cursor-pointer">{product?.name}</Card.Header>
          <Card.Meta>
            <span className="date text-gray-600">{product?.price} MXN</span>
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
              className={'mr-2'}
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
                  {isAddingToCart ? 'Añadiendo...' : fullWidth ? 'Añadir al carrito' : 'Añadir'}
                </Button>
              ) : null}
              {showDetailsBtn ? (
                <Button onClick={handleDetailsClick} variant="primary">
                  Details
                </Button>
              ): null}
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};
