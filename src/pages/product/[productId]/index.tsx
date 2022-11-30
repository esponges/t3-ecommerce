import { useRouter } from 'next/router';
import { Button } from '../../../components/atoms/button';
import { Container } from '../../../components/molecules/container';

import { ProductCard } from '../../../components/molecules/productCard';
import { useCartStore } from '../../../store/cart';
import { trpc } from '../../../utils/trpc';

const ProductDetails = () => {
  const router = useRouter();
  const id = typeof router.query.productId === 'string' ? router.query.productId : '';

  const { data: product, isLoading } = trpc.product.getById.useQuery({ id });

  const { addToCart } = useCartStore((state) => state);

  const handleAddToCart = (qty: number) => {
    if (product) {
      addToCart(product, qty);
    }
  };

  if (isLoading) {
    return <p>Loading product {id}...</p>;
  }

  return (
    <Container>
      <ProductCard
        name={product?.name}
        price={product?.price}
        description={product?.description}
        fullWidth
        showDetailsBtn={false}
        onAddToCart={handleAddToCart}
      />
      <div className="mt-5 flex justify-center">
        <Button variant="primary" extraClassName="mr-4" onClick={() => router.push('/cart')}>
          Go to cart
        </Button>
        <Button variant="secondary" className="mt-5" onClick={() => router.push('/cart')}>
          Go back
        </Button>
      </div>
    </Container>
  );
};

export default ProductDetails;
