import { useRouter } from 'next/router';
import type { Category } from '@prisma/client';
import {
  Item,
  Label,
  Message,
  Table
} from 'semantic-ui-react';

import { useProduct } from '@/lib/hooks/useProduct';

import { Button } from '@/components/atoms/button';
import { Counter } from '@/components/molecules/counter';
import { Image } from '@/components/atoms/image';


import { useDeviceWidth } from '@/lib/hooks/useDeviceWidth';
import { PageRoutes } from '@/lib/routes';

import type { Product } from '@/types';
import { Heading, HeadingSizes } from '@/components/atoms/heading';

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
  productSpecs,
  stock,
  onAddToCart,
  category,
  showDetails = true,
  showCTAs = true,
  qty,
  allowDetailsRedir = false,
}: Props) => {
  const { quantity, isAddingToCart, handleChangeProductQty, handleQtyInputChange, handleAddToCart } = useProduct({
    onAddToCart,
  });
  const { isMobile } = useDeviceWidth();
  const router = useRouter();

  const handleRedirectToDetails = () => {
    if (allowDetailsRedir && name) {
      void router.push(`${PageRoutes.Products}/${name}`);
    }
  };

  return (
    <div className={`product-item my-8 ${!isMobile ? 'columns-2' : 'my-4 px-4'}`}>
      <div className={`${!isMobile ? 'mx-auto w-3/4' : ''}`}>
        <Image
          src={image ?? '/images/empty-bottle.png'}
          alt="product"
          width={500}
          height={500}
          placeholder="blur"
          blurDataURL="/images/empty-bottle.png"
          className="w-full"
        />
      </div>
      <Item.Content className={`${!isMobile ? '' : 'text-center'}`}>
        <Heading
          onClick={handleRedirectToDetails}
          className={`${allowDetailsRedir ? 'cursor-pointer' : ''}`}
          size={HeadingSizes['5xl']}
        >
          {name}
        </Heading>
        <Item.Header as="h4" className="mt-4">
          {category?.name ? <Label>{category?.name}</Label> : null}
        </Item.Header>
        <Item.Meta>
          {!stock ? (
            <Message
              className="mt-4"
              warning
              header="Out of stock"
              content="This product is currently out of stock"
            />
          ) : (
            <>
              <span className="cinema font-bold text-xl">${price} USD</span>
              {qty && <span className="cinema ml-5">x{qty}</span>}
            </>
          )}
        </Item.Meta>
        {showDetails && <Item.Description className="mt-8">{description}</Item.Description>}
        {showCTAs && stock ? (
          <Item.Extra className="mt-8 text-center">
            <div className="mt-8 flex justify-center text-center">
              <Counter
                onIncrease={handleChangeProductQty}
                onDecrease={handleChangeProductQty}
                onChange={handleQtyInputChange}
                count={qty ?? quantity}
                className="mr-2"
                id="counter"
              />
              <Button onClick={handleAddToCart} variant="primary" disabled={isAddingToCart}>
                {isAddingToCart ? 'Adding...' : 'Shop now'}
              </Button>
            </div>
          </Item.Extra>
        ): null}
        {/* Technical details */}
        <Item.Extra className="mt-2 md:mt-4">
          <Table basic="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell clas>Details</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Capacity</Table.Cell>
                <Table.Cell>{productSpecs?.capacity || 'N/A'}.</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>More details</Table.Cell>
                <Table.Cell>{productSpecs?.volume || 'N/A'}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Item.Extra>
      </Item.Content>
    </div>
  );
};
