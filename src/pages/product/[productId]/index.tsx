import { useRouter } from 'next/router';

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
    <div className="px-10 py-5">
      <ProductCard
        name={product?.name}
        price={product?.price}
        description={product?.description}
        fullWidth
        showDetailsBtn={false}
        onAddToCart={handleAddToCart}
      />
      <button className="mt-5" onClick={() => router.push('/')}>
        Go back
      </button>
    </div>
  );
};

export default ProductDetails;
