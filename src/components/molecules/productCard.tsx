import { useRouter } from 'next/router';
import { Card, Image } from 'semantic-ui-react';

import type { Product } from '@prisma/client';

import { Button } from '../atoms/button';
import { Counter } from './counter';
import { useProduct } from '../../lib/hooks/useProduct';

type Props = Partial<Product> & {
  onClick?: () => void;
  onAddToCart?: (qty: number) => void;
  fullWidth?: boolean;
  showDetailsBtn?: boolean;
  inline?: boolean;
};

export const ProductCard = ({
  name,
  price,
  description,
  image,
  id,
  onClick,
  onAddToCart,
  fullWidth,
  inline,
  showDetailsBtn = true,
}: Props) => {
  const router = useRouter();

  const {
    quantity,
    isAddingToCart,
    handleChangeProductQty,
    handleQtyInputChange,
    handleAddToCart,
  } = useProduct({ onClick, onAddToCart });

  const handleDetailsClick = () => {
    if (id) {
      void router.push(`/product/${id}`);
    }
  };

  return (
    <div className="card m-2">
      <Card>
        <Image src={image ?? '/empty-bottle.png'} alt='product' wrapped ui={false} />
        <Card.Content>
          <Card.Header>{name}</Card.Header>
          <Card.Meta>
            <span className="date">{price} MXN</span>
          </Card.Meta>
          <Card.Description className='h-20'>{description}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div className="text-center justify-center flex">
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
