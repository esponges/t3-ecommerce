import type { Category, Product } from '@prisma/client';
import { Item, Label } from 'semantic-ui-react';

import { useProduct } from '@/lib/hooks/useProduct';

import { Button } from '@/components/atoms/button';
import { Counter } from '@/components/molecules/counter';

type Props = Partial<Product> & {
  onClick?: () => void;
  onAddToCart?: (qty: number) => void;
  category?: Partial<Category>;
};

export const ProductItem = ({ name, price, description, image, onAddToCart, category }: Props) => {
  const { quantity, isAddingToCart, handleChangeProductQty, handleQtyInputChange, handleAddToCart } = useProduct({ onAddToCart });

  return (
    <Item className="product-item flex">
      <div className="w-1/2">
        <Item.Image src={image} alt="product" />
      </div>
      <Item.Content>
        <Item.Header as="a">{name}</Item.Header>
        <Item.Meta>
          <span className="cinema">{price} MXN</span>
        </Item.Meta>
        <Item.Description className="mt-8">{description}</Item.Description>
        <Item.Extra className='mt-8 text-center'>
          {category?.name ? <Label>{category?.name}</Label> : null}
          <div className="flex justify-center text-center mt-8">
            <Counter
              onIncrease={handleChangeProductQty}
              onDecrease={handleChangeProductQty}
              onChange={handleQtyInputChange}
              count={quantity}
              extraClassName={'mr-2'}
            />
            <Button onClick={handleAddToCart} variant="primary" disabled={isAddingToCart}>
              {isAddingToCart ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </Item.Extra>
      </Item.Content>
    </Item>
  );
};