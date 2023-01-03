import { useForm } from 'react-hook-form';
import type { User } from '@prisma/client';
import { Button, Form } from 'semantic-ui-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import { useCartItems } from '@/lib/hooks/useCartItems';
import { sendConfirmationEmail } from '@/lib/order';

import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';
import { PageContainer } from '@/components/layouts/pageContainer';

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
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: checkoutDefaultValues });

  const { data: session } = useSession();
  const user: User | undefined = session?.user as User | undefined;

  const { cartItems } = useCartItems();

  const utils = trpc.useContext();

  const createOrder = trpc.order.create.useMutation({
    onMutate: async (_values) => {
      // optimistic update
      // mutation about to happen
      // you can do something like this
      // await utils.order.getAll.cancel();
      // const optimisticOrders = utils.order.getAll.getData();

      // if (optimisticOrders) {
      //   utils.order.getAll.setData(optimisticOrders);
      // }
    },

    onSuccess: (data, _variables, _context) => {
      // TODO: for the moment we must do this client side.
      // We can't do this server side because of the emailjs library
      // there's a trpc.order.success hook that we can use to send the email
      // server side but I have not checked how to do it yet with a different library
      // sendConfirmationEmail();
      router.push(`/auth/account/order/confirm/${data.id}`);
    },

    onError: (_err, _values, _context) => {
      // rollback?
    },
    onSettled: async () => {
      // Error or success... doesn't matter!
      // refetch the query
      await utils.order.getByUserId.invalidate();
      console.log('onSettled rdy');
    },
  });

  const handleFormSubmit = (data: CheckoutFormValues) =>
    void (async () => {
      const { mutateAsync } = createOrder;

      if (!user?.id) {
        // todo: handle this
        return;
      }

      await mutateAsync({ 
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
    })();

  return (
    <PageContainer>
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
          <input 
            type="text" className="form-control" id="postalCode" {...register('postalCode', { required: true })}
          />
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
      <div className="mt-10 text-right">
        <Link href="/cart">
          <Button className="btn btn-secondary mt-5">Go back</Button>
        </Link>
      </div>
    </PageContainer>
  );
};

Checkout.requireAuth = true;

export default Checkout;
