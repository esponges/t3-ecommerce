import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';
import { MainLayout } from '../../../components/layouts/main';
import { useCartStore } from '../../../store/cart';
import { trpc } from '../../../utils/trpc';

const ProductDetails = () => {
  const router = useRouter();
  const id = typeof router.query.productId === 'string' ? router.query.productId : '';

  const { data: product, isLoading } = trpc.product.getById.useQuery({ id });

  const { addToCart, items } = useCartStore((state) => state);
  const itemCartCount = items[id]?.quantity || 0;
  const [count, setCount] = useState(1);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, count);
    }
  };

  if (isLoading) {
    return <p>Loading product {id}...</p>;
  }

  return (
    <div className="px-10 py-5">
      <h1>Product Details</h1>
      <p>Product ID: {product?.id}</p>
      <p>Product Name: {product?.name}</p>
      <p>Product Description: {product?.description}</p>
      <p>Product Price: {product?.price}</p>
      <p>In the cart {itemCartCount}</p>
      <div className="mt-5">
        <p>
          Quantity: {count}{' '}
          <span>
            <button onClick={() => setCount(count + 1)}>Add +</button>
          </span>
        </p>
        <button className="mt-1" onClick={handleAddToCart}>
          Add to cart
        </button>
      </div>
      <button className="mt-5" onClick={() => router.push('/')}>
        Go back
      </button>
    </div>
  );
};

ProductDetails.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default ProductDetails;
