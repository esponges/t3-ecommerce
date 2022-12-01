import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import type { Product } from '@prisma/client';

import { Button } from '../atoms/button';
import { Counter } from './counter';
import { Header } from '../atoms/header';

type Props = Partial<Product> & {
  onClick?: () => void;
  onAddToCart?: (qty: number) => void;
  fullWidth?: boolean;
  width?: string;
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
  width
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
    <div
      className={
        `group relative rounded-lg p-4 shadow-lg md:m-4 
        ${fullWidth ? 'flex md:w-[85%]' : ''}
        ${width ? `w-[${width}]` : ''}
        `}
    >
      <div
        className="aspect-w-1 aspect-h-1 lg:aspect-none 
        w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75"
      >
        <Image
          src={image ?? '/empty-bottle.png'}
          width={50}
          height={50}
          layout="responsive"
          alt={description}
          onClick={onClick}
        />
      </div>
      <div className={`mt-4 ${fullWidth || inline ? 'block' : 'flex'} ${fullWidth ? ' w-[80%]' : ''} ml-auto justify-between pb-12`}>
        <div className='text-right'>
          <Header>{name}</Header>
          <p className="mt-1 m-w-[50%] hidden md:block text-sm text-gray-500">{description}</p>
        </div>
        <div className={`${inline ? 'text-right' : ''} ${fullWidth ? 'mt-6' : ''}`}>
          <p className={`text-right md:text-xl font-medium text-gray-900`}>${price} MXN</p>
          {/* Btns */}
          <div className={`md:mb-4 mb-2 sm:mr-2 md:mr-4 block flex justify-between absolute ${fullWidth ? '' : 'bottom-0'} right-0`}>
            {fullWidth && (
              <Counter
                onIncrease={handleChangeProductQty}
                onDecrease={handleChangeProductQty}
                onChange={handleQtyInputChange}
                count={quantity}
                extraClassName="hidden lg:block"
              />
            )}
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
        </div>
      </div>
    </div>
  );
};
