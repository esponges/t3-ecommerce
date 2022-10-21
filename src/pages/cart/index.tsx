import { useCartStore } from '../../store/cart';
import { trpc } from '../../utils/trpc';

const Cart = () => {
  const { items } = useCartStore((state) => state);
  const createOrder = trpc.useMutation('order.create');

  const handleSend = () => {
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
    createOrder.mutate({
      userId: 'cl9iv3dwe0004m2q1zvdtt420',
      orderItems: Object.values(items).map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      orderDetails: [{
        address: 'foo',
        city: 'bar',
        country: 'test',
        postalCode: 'test',
        phone: 'test',
      }],
    });
  };

  return (
    <div className="px-10 py-5">
      <h1>Cart</h1>
      <ul>
        {Object.entries(items).map(([id, item]) => (
          <li key={id}>
            {item.name} - {item.price} - {item.quantity}
          </li>
        ))}
      </ul>
      {/* test email JS send */}
      <div>
        Total price: $ {Object.values(items).reduce((acc, item) => acc + item.price * item.quantity, 0)}
      </div>
      <button className="mt-10" onClick={handleSend}>
        Confirm Order
      </button>
    </div>
  );
};

export default Cart;
