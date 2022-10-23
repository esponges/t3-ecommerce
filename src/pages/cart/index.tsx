import { useEffect, useState } from 'react';
import { useCartStore, CartItems } from '../../store/cart';
import { trpc } from '../../utils/trpc';

const userId = 'cl9iv3dwe0004m2q1zvdtt420';

const Cart = () => {
  const { items } = useCartStore((state) => state);
  const [cartItems, setCartItems] = useState<CartItems>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCartItems(items);
    }
  }, [items]);

  const ctx = trpc.useContext();
  const createOrder = trpc.useMutation('order.create', {
    onSuccess: () => {
      // alert('Order created! now send email to the user with the details');
      // send(
      //   process.env.EMAILJS_SERVICE_ID as string,
      //   process.env.EMAILJS_TEMPLATE_ID as string,
      //   {
      //     message_html: 'test',
      //     to_name: 'Buyer',
      //     to_email: 'esponges@gmail.com',
      //     from_name: 'cool shop',
      //     reply_to: process.env.EMAILJS_FROM_EMAIL as string,
      //   },
      //   process.env.EMAILJS_USER_ID_PUBLIC_KEY as string
      // )
      //   .then((response) => {
      //     console.log('SUCCESS!', response.status, response.text);
      //   })
      //   .catch((err) => {
      //     console.log('FAILED...', err);
      //   });

      // find the order in the database and send the email
      const order = ctx.getQueryData(['order.getByUserId', { userId: userId }]);
      console.log(order);
    },
  });
  const { data: orders } = trpc.useQuery(['order.getAll']);
  const { data: userOrders } = trpc.useQuery(['order.getByUserId', { userId: userId }]);
  console.log(orders, 'user orders', userOrders);

  const handleSend = () => {
    const order = createOrder.mutate({
      userId: userId,
      orderItems: Object.values(items).map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      orderDetails: [
        {
          address: 'foo',
          city: 'bar',
          country: 'test',
          postalCode: 'test',
          phone: 'test',
        },
      ],
    });

    console.log(order);
  };

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
      {/* test email JS send */}
      <div>Total price: $ {Object.values(cartItems).reduce((acc, item) => acc + item.price * item.quantity, 0)}</div>
      <button className="mt-10" onClick={handleSend}>
        Confirm Order
      </button>
    </div>
  );
};

export default Cart;
