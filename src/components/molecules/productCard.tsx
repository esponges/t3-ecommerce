import { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, Image } from 'semantic-ui-react';

import type { Product } from '@prisma/client';

import { Button } from '../atoms/button';
import { Counter } from './counter';
import { Header } from '../atoms/header';

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
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleDetailsClick = () => {
    if (id) {
      void router.push(`/product/${id}`);
    }
  };

  const handleChangeProductQty = (value: number) => {
    if (quantity + value > 0) {
      setQuantity(quantity + value);
    }
  };

  const handleQtyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);

    if (value > 0 || e.target.value === '') {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      setIsAddingToCart(true);
      onAddToCart(quantity);

      // ideally this would be a toast
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 500);
    }
  };

  return (
    <div className="card">
      <Card>
        <Image src={image ?? '/empty-bottle.png'} wrapped ui={false} />
        <Card.Content>
          <Card.Header>{name}</Card.Header>
          <Card.Meta>
            <span className="date">{price} MXN</span>
          </Card.Meta>
          <Card.Description>Matthew is a musician living in Nashville.</Card.Description>
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
