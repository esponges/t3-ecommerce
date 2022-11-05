import Link from 'next/link';
import { ReactElement } from 'react';
import { MainLayout } from '../../components/layouts/main';
import { useCartItems } from '../../lib/hooks/useCartItems';

const Cart = () => {
  const { cartItems, cartTotal } = useCartItems();

  return (
    <div className="px-10 py-5">
      <h1>Cart</h1>
      <ul>
        {Object.entries(cartItems).map(([id, item]) => (
          <li key={id}>
            {item.name} - {item.price} - {item.quantity}
          </li>
        ))}
      </ul>
      <div>Total price: ${cartTotal}</div>
      <div className='mt-10'>
        <Link href="/checkout">
          {/* to do: don't allow non auth users to
          go to the checkout, make them login and 
          then redirect them after login */}
          <a>Go to checkout</a>
        </Link>
      </div>
      <div className='mt-5'>
        <Link href="/">
          <a>Go back</a>
        </Link>
      </div>
    </div>
  );
};

Cart.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
};

export default Cart;
