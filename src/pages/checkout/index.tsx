import { useState } from 'react';
import { send } from 'emailjs-com';
import { useForm } from 'react-hook-form';
import type { ReactElement } from 'react';
import type { User } from '@prisma/client';
import { Button, Form } from 'semantic-ui-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import { useCartItems } from '@/lib/hooks/useCartItems';
import { trpc } from '@/utils/trpc';
import { ProtectedLayout } from '@/components/layouts/protected';

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

const Checkout = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: checkoutDefaultValues });

  const { data: session } = useSession();
  const user: User|undefined = session?.user as User|undefined;

  const { cartItems } = useCartItems();

  const utils = trpc.useContext();

  const [orderSent, setOrderSent] = useState(false);
  const [orderId, setOrderId] = useState<string | null>();

  // this doesn't go here
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
    const { mutateAsync } = createOrder;

    if (!user?.id) {
      // todo: handle this
      return;
    }

    const res = await mutateAsync({
      // todo: check where this user id comes from
      // it was breaking the request
      // chatGPT message:  the foreign key constraint error you were getting indicates that one of the values you were using for a foreign key field did not have a corresponding record in the related table. In this case, it seems like the userId value you were using did not exist in the User table, which caused the error.
      userId: user?.id,
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
    <div className="my-10 mx-auto md:w-1/2">
      <h1 className="mb-10">Checkout</h1>
      <Form onSubmit={handleSubmit(handleFormSubmit)}>
        <Form.Field>
          <label htmlFor="address" className="form-label font-bold">
            Address
          </label>
          <input type="text" className="form-control" id="address" {...register('address', { required: true })} />
          {errors.address && <span className="text-danger">This field is required</span>}
        </Form.Field>
        <Form.Field>
          <label htmlFor="city" className="form-label font-bold">
            City
          </label>
          <input type="text" className="form-control" id="city" {...register('city', { required: true })} />
          {errors.city && <span className="text-danger">This field is required</span>}
        </Form.Field>
        <Form.Field>
          <label htmlFor="country" className="form-label font-bold">
            Country
          </label>
          <input type="text" className="form-control" id="country" {...register('country', { required: true })} />
          {errors.country && <span className="text-danger">This field is required</span>}
        </Form.Field>
        <Form.Field>
          <label htmlFor="postalCode" className="form-label font-bold">
            Postal Code
          </label>
          <input type="text" className="form-control" id="postalCode" {...register('postalCode', { required: true })} />
          {errors.postalCode && <span className="text-danger">This field is required</span>}
        </Form.Field>
        <Form.Field>
          <label htmlFor="phone" className="form-label font-bold">
            Phone
          </label>
          <input type="text" className="form-control" id="phone" {...register('phone', { required: true })} />
          {errors.phone && <span className="text-danger">This field is required</span>}
        </Form.Field>
        <Button type="submit" className="btn btn-primary mt-5">
          Proceed and pay
        </Button>
      </Form>
      {/* go back button */}
      <div className='mt-10 text-right'>
        <Link href="/cart">
          <Button className="btn btn-secondary mt-5">Go back</Button>
        </Link>
      </div>
    </div>
  );
};

Checkout.getLayout = function getLayout(page: ReactElement) {
  // TODO: create some kind of layout for this component
  return page;
};

export default Checkout;
