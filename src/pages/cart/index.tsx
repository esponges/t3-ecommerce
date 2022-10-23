import Link from 'next/link';
import { useCartItems } from '../../utils/hooks/useCartItems';

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
          <a>Go to checkout</a>
        </Link>
      </div>
    </div>
  );
};

export default Cart;
