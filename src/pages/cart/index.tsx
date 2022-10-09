import { useCartStore } from '../../store/cart';

const Cart = () => {
  const { items } = useCartStore((state) => state);

  return (
    <div className="px-10 py-5">
      <h1>Cart</h1>
      <ul>
        {Object.entries(items).map(([id, item]) => (
          <li key={id}>
            {item.name} - {item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cart;
