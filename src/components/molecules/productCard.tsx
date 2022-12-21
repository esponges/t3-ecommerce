import { useRouter } from 'next/router';
import { Card } from 'semantic-ui-react';

import type { Product } from '@prisma/client';

import { Button } from '@/components/atoms/button';
import { Counter } from '@/components/molecules/counter';
import { useProduct } from '@/lib/hooks/useProduct';
import { useCartStore } from '@/store/cart';
import Image from 'next/image';

type Props = {
  product?: Product;
  onClick?: () => void;
  onAddToCart?: (qty: number) => void;
  redirOnImageClick?: boolean;
  fullWidth?: boolean;
  showDetailsBtn?: boolean;
  inline?: boolean;
};

export const ProductCard = ({
  product,
  /* onClick, */
  onAddToCart,
  fullWidth,
  inline,
  showDetailsBtn = true,
  redirOnImageClick = true,
}: Props) => {
  const router = useRouter();
  const { addToCart } = useCartStore();

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
    if (product?.id) {
      void router.push(`/product/${product?.id}`);
    }
  };

  return (
    <div className="card m-2">
      <Card>
        <div onClick={redirOnImageClick ? handleDetailsClick : undefined}>
          <Image
            src={product?.image ?? '/empty-bottle.png'}
            alt="product"
            className="pointer-events-auto w-full"
            placeholder="blur"
            blurDataURL="/empty-bottle.png"
            width={300}
            height={300}
          />
        </div>
        <Card.Content>
          <Card.Header>{product?.name}</Card.Header>
          <Card.Meta>
            <span className="date">{product?.price} MXN</span>
          </Card.Meta>
          <Card.Description className="h-20">{product?.description}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div className="flex justify-center text-center">
            <Counter
              onIncrease={handleChangeProductQty}
              onDecrease={handleChangeProductQty}
              onChange={handleQtyInputChange}
              count={quantity}
              extraClassName={'mr-2'}
            />
            <Button
              onClick={handleAddToCart}
              variant="primary"
              extraClassName={`${inline ? 'mr-2' : ''}`}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? 'Adding...' : fullWidth ? 'Add to cart' : 'Add'}
            </Button>
            {showDetailsBtn && (
              <Button onClick={handleDetailsClick} variant="primary">
                Details
              </Button>
            )}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};
