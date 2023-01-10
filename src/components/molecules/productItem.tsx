import type { Category, Product } from '@prisma/client';
import { Item, Label } from 'semantic-ui-react';

import { useProduct } from '@/lib/hooks/useProduct';

import { Button } from '@/components/atoms/button';
import { Counter } from '@/components/molecules/counter';
import Image from 'next/image';
import { useDeviceWidth } from '@/lib/hooks/useDeviceWidth';
import { useRouter } from 'next/router';

type Props = Partial<Product> & {
  onClick?: () => void;
  onAddToCart?: (qty: number) => void;
  category?: Partial<Category>;
  showDetails?: boolean;
  showCTAs?: boolean;
  qty?: number;
  allowDetailsRedir?: boolean;
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
  allowDetailsRedir = false,
  id,
}: Props) => {
  const { quantity, isAddingToCart, handleChangeProductQty, handleQtyInputChange, handleAddToCart } = useProduct({
    onAddToCart,
  });
  const { isMobile } = useDeviceWidth();
  const router = useRouter();

  const handleRedirectToDetails = () => {
    if (allowDetailsRedir && id) {
      void router.push(`/product/${id}`);
    }
  };

  return (
    <div className={`product-item ${!isMobile ? 'columns-2' : ''}`}>
      <div className={`${!isMobile ? 'mx-auto w-3/4' : ''}`}>
        <Image
          src={image ?? '/empty-bottle.png'}
          alt="product"
          width={500}
          height={500}
          placeholder="blur"
          blurDataURL={'/empty-bottle.png'}
          className="w-full"
        />
      </div>
      <Item.Content className={`${!isMobile ? '' : 'text-center'}`}>
        <Item.Header
          as="a"
          onClick={handleRedirectToDetails}
          className={`${allowDetailsRedir ? 'cursor-pointer' : ''}`}
        >
          {name}
        </Item.Header>
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
    </div>
  );
};
