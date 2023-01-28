import { useForm } from 'react-hook-form';
import type { User } from '@prisma/client';
import { Form } from 'semantic-ui-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import { useCartItems } from '@/lib/hooks/useCartItems';

import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';
import { PageContainer } from '@/components/layouts/pageContainer';
import { Header } from '@/components/atoms/header';
import { Button } from '@/components/atoms/button';
import { InputMessage } from '@/components/atoms/inputMessage';
import { Searchbar } from '@/components/molecules/searchbar';

const checkoutDefaultValues = {
  address: '',
  city: '',
  country: '',
  postalCode: '',
  phone: '',
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

  const successfulOrderConfirmation = trpc.order.success.useMutation();
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

    onSuccess: async (data, _variables, _context) => {
      // TODO: for the moment we must do this client side.
      // We can't do this server side because of the emailjs library
      // there's a trpc.order.success hook that we can use to send the email
      // server side but I have not checked how to do it yet with a different library
      // sendConfirmationEmail();
      const { mutateAsync } = successfulOrderConfirmation;
      if (data?.id && data.userId) {
        await mutateAsync({
          id: data.id,
          userId: data.userId,
        });
      }
      // router.push(`/auth/account/order/confirm/${data.id}`);
    },

    onError: (_err, _values, _context) => {
      // rollback?
    },
    onSettled: async () => {
      // Error or success... doesn't matter!
      // refetch the query
      await utils.order.getByUserId.invalidate();
    },
  });

  const isCreating = createOrder.isLoading;

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

  // TODO: add cp dropdown and delivery hour & day
  return (
    <PageContainer>
      <Header size="5xl">Finalizar pedido</Header>
      <Form onSubmit={handleSubmit(handleFormSubmit)}>
        <Form.Field>
          <label htmlFor="address" className="form-label font-bold">
            Dirección de envío
          </label>
          <input
            type="text"
            placeholder="Calle/Av, Exterior e Interior"
            className="form-control"
            id="address"
            {...register('address', { required: true })}
          />
          {errors.address && <InputMessage type="error" message="Requerido" />}
        </Form.Field>
        <Form.Field>
          <label htmlFor="city" className="form-label font-bold">
            Ciudad
          </label>
          <input
            type="text"
            placeholder="Municipio"
            className="form-control"
            id="city"
            {...register('city', { required: true })}
          />
          {errors.city && <InputMessage type="error" message="Requerido" />}
        </Form.Field>
        <Form.Field>
          <label htmlFor="postalCode" className="form-label font-bold">
            Código Postal
          </label>
          <Searchbar
            placeholder="Código postal"
            onChange={(e) => console.log(e.target.value)}
            onSelect={(e) => console.log(e)}
            inputProps={
              register('postalCode', { required: true })
            }
          />
          {errors.postalCode && <InputMessage type="error" message="Requerido" />}
        </Form.Field>
        <Form.Field>
          <label htmlFor="phone" className="form-label font-bold">
            Teléfono de contacto
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Teléfono de 10 dígitos"
            id="phone"
            {...register('phone', { required: true, minLength: 10, maxLength: 10 })}
          />
          {errors.phone && <InputMessage type="error" message="Requerido" />}
        </Form.Field>
        <Button variant="primary" className="btn btn-primary mt-5" type="submit" disabled={isCreating}>
          {isCreating ? 'Generando pedido...' : 'Finalizar pedido'}
        </Button>
      </Form>
      {/* go back button */}
      <div className="mt-10 text-right">
        <Link href="/cart">
          <Button variant="secondary" className="btn btn-secondary mt-5" disabled={isCreating}>
            Regresa
          </Button>
        </Link>
      </div>
    </PageContainer>
  );
};

Checkout.requireAuth = true;

export default Checkout;
