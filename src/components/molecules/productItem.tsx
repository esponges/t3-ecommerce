import type { Product } from '@prisma/client';
import { useState } from 'react';
import { Button, Icon, Item, Label } from 'semantic-ui-react';
import { useProduct } from '../../lib/hooks/useProduct';

type Props = Partial<Product> & {
  onClick?: () => void;
  onAddToCart?: (qty: number) => void;
};

export const ProductItem = ({
  name,
  price,
  description,
  image,
  id,
  onClick,
  onAddToCart,
}: Props) => {
  const {
    quantity,
    isAddingToCart,
    handleChangeProductQty,
    handleQtyInputChange,
    handleAddToCart,
  } = useProduct({});

  return (
    <Item className='product-item flex'>
      <div className='w-1/2'>
        <Item.Image src={image} alt='product' />
      </div>
      <Item.Content>
        <Item.Header as='a'>{name}</Item.Header>
        <Item.Meta>
          <span className='cinema'>{price} MXN</span>
        </Item.Meta>
        <Item.Description className='mt-8'>{description}</Item.Description>
        <Item.Extra>
          <Label>Category here</Label>
          <Label icon='globe' content='Additional Languages' />
          <Button.Group floated='right'>
            <Button primary>
              Buy tickets
              {/* <Icon name='right chevron' /> */}
            </Button>
          </Button.Group>
        </Item.Extra>
      </Item.Content>
    </Item>
  );
};

