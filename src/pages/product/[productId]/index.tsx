import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";

const ProductDetails = () => {
  const router = useRouter();
  const id = typeof router.query.productId === "string" ? router.query.productId : '';

  const { data: product, isLoading } = trpc.useQuery(['product.getById', { id }]);

  if (isLoading) {
    return <p>Loading product {id}...</p>;
  }
  
  return (
    <div>
      <h1>Product Details</h1>
      <p>Product ID: {product?.id}</p>
      <p>Product Name: {product?.name}</p>
      <p>Product Description: {product?.description}</p>
      <button onClick={() => router.push('/')}>Go back</button>
    </div>
  );
}

export default ProductDetails;
