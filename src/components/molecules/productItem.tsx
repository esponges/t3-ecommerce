import type { Category, Product } from '@prisma/client';
import { Item, Label } from 'semantic-ui-react';

import { useProduct } from '@/lib/hooks/useProduct';

import { Button } from '@/components/atoms/button';
import { Counter } from '@/components/molecules/counter';
import Image from 'next/image';
import { useDeviceWidth } from '@/lib/hooks/useDeviceWidth';

type Props = Partial<Product> & {
  onClick?: () => void;
  onAddToCart?: (qty: number) => void;
  category?: Partial<Category>;
  showDetails?: boolean;
  showCTAs?: boolean;
  qty?: number;
};

export const ProductItem = ({
  name,
  price,
  description,
  image,
  onAddToCart,
  category,
  showDetails = true,
  showCTAs = true,
  qty,
}: Props) => {
  const { quantity, isAddingToCart, handleChangeProductQty, handleQtyInputChange, handleAddToCart } = useProduct({
    onAddToCart,
  });
  const { isMobile } = useDeviceWidth();

  return (
    <Item className={`product-item ${!isMobile ? 'flex' : ''}`}>
      <div className={`${!isMobile ? 'w-1/2' : ''}`}>
        <Image
          src={image ?? '/empty-bottle.png'}
          alt="product"
          width={400}
          height={400}
          placeholder="blur"
          blurDataURL={'/empty-bottle.png'}
        />
      </div>
      <Item.Content className={`${!isMobile ? '' : 'text-center'}`}>
        <Item.Header as="a">{name}</Item.Header>
        <Item.Meta>
          <span className="cinema">{price} MXN</span> 
          {qty && <span className="cinema ml-5">x{qty}</span>}
        </Item.Meta>
        {showDetails && <Item.Description className="mt-8">{description}</Item.Description>}
        {showCTAs && (
          <Item.Extra className="mt-8 text-center">
            {category?.name ? <Label>{category?.name}</Label> : null}
            <div className="mt-8 flex justify-center text-center">
              <Counter
                onIncrease={handleChangeProductQty}
                onDecrease={handleChangeProductQty}
                onChange={handleQtyInputChange}
                count={qty ?? quantity}
                extraClassName={'mr-2'}
              />
              <Button onClick={handleAddToCart} variant="primary" disabled={isAddingToCart}>
                {isAddingToCart ? 'Adding...' : 'Add'}
              </Button>
            </div>
          </Item.Extra>
        )}
      </Item.Content>
    </Item>
  );
};
