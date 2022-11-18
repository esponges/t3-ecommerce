import { send } from 'emailjs-com';
import { useForm } from 'react-hook-form';
import { ReactElement } from 'react';

import { useCartItems } from '../../lib/hooks/useCartItems';
import { trpc } from '../../utils/trpc';
import { useState } from 'react';
import { ProtectedLayout } from '../../components/layouts/protected';

const checkoutDefaultValues = {
  address: 'Foo Address',
  city: 'Bar City',
  country: 'Mars',
  postalCode: '666',
  phone: '6666666666',
};

interface CheckoutFormValues {
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
}

// todo: don't hardcode userId
const userId = 'cl9iv3dwe0004m2q1zvdtt420';

const Checkout = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: checkoutDefaultValues });

  const { cartItems } = useCartItems();

  const utils = trpc.useContext();

  const [orderSent, setOrderSent] = useState(false);
  const [orderId, setOrderId] = useState<string | null>();

  const { isLoading: orderHasNotBeenResolved, data: orderData } = trpc.order.getById.useQuery(
    { id: orderId },
    {
      enabled: !!orderId,
      onSuccess: () => {
        console.log(
          // eslint-disable-next-line max-len
          'getByOrderId has been resolved, you can do something outside of the hook - the data is not available here though'
        );
      },
    }
  );

  const createOrder = trpc.order.create.useMutation({
    onMutate: async (_values) => {
      // optimistic update
      // mutation about to happen
      // you can do something like this
      await utils.order.getAll.cancel();
      const optimisticOrders = utils.order.getAll.getData();

      if (optimisticOrders) {
        utils.order.getAll.setData(optimisticOrders);
      }
    },

    onSuccess: (_data, _variables, _context) => {
      // do stuff after mutation success
      setOrderSent(true);

    },

    onError: (_err, _values, _context) => {
      // rollback?
    },
    onSettled: async () => {
      // Error or success... doesn't matter! 
      // refetch the query
      await utils.order.getAll.invalidate();
    },
  });

  const handleFormSubmit = (data: CheckoutFormValues) => void (async () => {
    // tried with with mutateAsync but received undefined
    const { mutateAsync } = createOrder;
    const res = await mutateAsync({
      userId: userId,
      orderItems: Object.values(cartItems).map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      orderDetail: {
        address: data.address,
        city: data.city,
        country: data.country,
        postalCode: data.postalCode,
        phone: data.phone,
      },
    });

    if (res && res.id) {
      // opt 1: add order id and send email on rerender (not ideal)
      setOrderId(res.id);

      // opt 2: send email here with the data that we have from the
      // form, mutateAsync and the store state (better)
      send(
        process.env.EMAILJS_SERVICE_ID as string,
        process.env.EMAILJS_TEMPLATE_ID as string,
        {
          // update email body with the order details and real user details
          message_html: 'test',
          to_name: 'Buyer',
          to_email: 'foobar@gmail.com',
          from_name: 'cool shop',
          reply_to: process.env.EMAILJS_FROM_EMAIL as string,
        },
        process.env.EMAILJS_USER_ID_PUBLIC_KEY as string
      )
        .then((response) => {
          console.log('SUCCESS!', response.status, response.text);
          // probably redirect to order confirmation page
        })
        .catch((err) => {
          console.log('FAILED...', err);
          // show feedback to user of some of error
        });
    } else {
      // show error to user
    }
  })();

  return (
    <div className="px-10 py-5">
      <h1 className="mb-10">Checkout</h1>
      <form onSubmit={void handleSubmit(handleFormSubmit)} className="md:w-[50]">
        <div className="mb-5 grid">
          <label htmlFor="address" className="form-label font-bold">
            Address
          </label>
          <input type="text" className="form-control" id="address" {...register('address', { required: true })} />
          {errors.address && <span className="text-danger">This field is required</span>}
        </div>
        <div className="mb-5 grid">
          <label htmlFor="city" className="form-label font-bold">
            City
          </label>
          <input type="text" className="form-control" id="city" {...register('city', { required: true })} />
          {errors.city && <span className="text-danger">This field is required</span>}
        </div>
        <div className="mb-5 grid">
          <label htmlFor="country" className="form-label font-bold">
            Country
          </label>
          <input type="text" className="form-control" id="country" {...register('country', { required: true })} />
          {errors.country && <span className="text-danger">This field is required</span>}
        </div>
        <div className="mb-5 grid">
          <label htmlFor="postalCode" className="form-label font-bold">
            Postal Code
          </label>
          <input type="text" className="form-control" id="postalCode" {...register('postalCode', { required: true })} />
          {errors.postalCode && <span className="text-danger">This field is required</span>}
        </div>
        <div className="mb-5 grid">
          <label htmlFor="phone" className="form-label font-bold">
            Phone
          </label>
          <input type="text" className="form-control" id="phone" {...register('phone', { required: true })} />
          {errors.phone && <span className="text-danger">This field is required</span>}
        </div>
        <button type="submit" className="btn btn-primary mt-5">
          Proceed and pay
        </button>
      </form>
      <div className="mt-10">
        <h2 className="mb-5">Order summary</h2>
        <div className="grid grid-cols-2">
          <div className="flex flex-col">
            {orderSent ? (
              <div className="text-success">Order sent successfully</div>
            ) : (
              <div className="text-danger">Order not sent</div>
            )}
            <div className="text-primary">Order items</div>
            <div className="text-primary">Order details</div>
          </div>
        </div>
      </div>
    </div>
  );
};

Checkout.getLayout = function getLayout(page: ReactElement) {
  return <ProtectedLayout>{page}</ProtectedLayout>
};

export default Checkout;
