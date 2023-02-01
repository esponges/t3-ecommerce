import { useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { User } from '@prisma/client';
import {
  Dropdown,
  Form,
  Accordion,
  Icon
} from 'semantic-ui-react'
import type { DropdownProps } from 'semantic-ui-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useCartItems } from '@/lib/hooks/useCartItems';
import {
  getAvailableDaysOptions,
  getScheduleOptions,
  validation
} from '@/lib/checkout'

import { trpc } from '@/utils/trpc';

import { PageContainer } from '@/components/layouts/pageContainer';
import { Header } from '@/components/atoms/header';
import { Button } from '@/components/atoms/button';
import { InputMessage } from '@/components/atoms/inputMessage';

import type { TableCartItem } from '../cart';
import { CartItems } from '@/components/molecules/cartItems';
import Head from 'next/head';

const checkoutDefaultValues = {
  address: '',
  city: '',
  postalCode: '',
  phone: '',
  schedule: '',
  day: '',
};

interface CheckoutFormValues {
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  schedule: string;
  day: string;
}

const cps = [
  {
    key: 1,
    text: 'CP 1',
    value: 1,
  },
  {
    key: 2,
    text: 'CP 2',
    value: 2,
  },
  {
    key: 3,
    text: 'CP 3',
    value: 3,
  },
];

const Checkout = () => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number | undefined>(0);

  const { data: session } = useSession();
  const user: User | undefined = session?.user as User | undefined;

  const { cartItems, cartTotal } = useCartItems();
  const tableCartItems: TableCartItem[] = Object.values(cartItems).map((item) => ({
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    id: item.id,
  }));

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    setError,
  } = useForm({ defaultValues: checkoutDefaultValues });

  const utils = trpc.useContext();
  const successfulOrderConfirmation = trpc.order.success.useMutation();
  const { mutateAsync, isLoading: isCreating } = trpc.order.create.useMutation({
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

  const chosenDay = getValues('day');
  const daysOptions = useMemo(() => getAvailableDaysOptions(), []);
  const scheduleOptions = useMemo(() => getScheduleOptions(chosenDay), [chosenDay]);

  const handleDayChange = (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    if (data.value && typeof data.value === 'string') {
      setValue('day', data.value);
      setError('day', {});
    }
  };

  const handleScheduleChange = (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    if (data.value && typeof data.value === 'string') {
      setValue('schedule', data.value);
      setError('schedule', {});
    }
  };

  const handleCPChange = (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    if (data.value) {
      setError('postalCode', {});
      if (typeof data.value === 'string') {
        setValue('postalCode', data.value);
        return;
      }
      if (typeof data.value === 'number') {
        setValue('postalCode', data.value.toString());
        return;
      }
      console.error('CP value is not a string or number');
    }
  };

  const handleAccordionOpenClose = () => {
    setActiveIndex(activeIndex === 0 ? undefined : 0);
  };

  const handleFormSubmit = (data: CheckoutFormValues) =>
    void (async () => {
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
          country: 'MX',
          postalCode: data.postalCode,
          phone: data.phone,
          day: data.day,
          schedule: data.schedule,
        },
        total: cartTotal,
      });
    })();

  // TODO: add cp dropdown and delivery hour & day
  return (
    <>
      <Head>
        {/* dont index */}
        <meta name="robots" content="noindex" />
        <title>Finalizar pedido</title>
      </Head>
      <PageContainer>
        <Header size="5xl">Finalizar pedido</Header>
        <Accordion
          className="my-8"
        >
          <Accordion.Title active={activeIndex === 0} index={0} onClick={handleAccordionOpenClose}>
            <Icon name="dropdown" />
            Tu pedido
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            <CartItems tableItems={tableCartItems} cartTotal={cartTotal} />
          </Accordion.Content>
        </Accordion>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* chose day */}
          <Form.Field>
            <label htmlFor="day" className="form-label font-bold">
              Día de entrega
            </label>
            <Dropdown
              placeholder="Día de entrega"
              fluid
              selection
              options={daysOptions}
              {...register('day', validation.day)}
              onChange={handleDayChange}
            />
            {errors.day?.message && <InputMessage type="error" message={errors.day.message} />}
          </Form.Field>
          {/* chose schedule */}
          <Form.Field>
            <label htmlFor="schedule" className="form-label font-bold">
              Horario de entrega
            </label>
            <Dropdown
              placeholder={chosenDay ? 'Horario de entrega' : 'Elige primero el día'}
              fluid
              selection
              options={scheduleOptions}
              disabled={!chosenDay}
              {...register('schedule', validation.schedule)}
              onChange={handleScheduleChange}
            />
            {errors.schedule?.message && <InputMessage type="error" message={errors.schedule.message} />}
          </Form.Field>
          <Form.Field>
            <label htmlFor="address" className="form-label font-bold">
              Dirección de envío
            </label>
            <input
              type="text"
              placeholder="Calle/Av + Exterior e Interior"
              className="form-control"
              id="address"
              {...register('address', validation.address)}
            />
            {errors.address && <InputMessage type="error" message={errors.address.message || 'Requerido'} />}
          </Form.Field>
          <Form.Field>
            <label htmlFor="city" className="form-label font-bold">
              Municipio
            </label>
            <input
              type="text"
              placeholder="Municipio"
              className="form-control"
              id="city"
              {...register('city', validation.city)}
            />
            {errors.city && <InputMessage type="error" message={errors.city.message ?? 'Requerido'} />}
          </Form.Field>
          <Form.Field>
            <label htmlFor="postalCode" className="form-label font-bold">
              Código Postal
            </label>
            <Dropdown
              selection
              options={cps}
              placeholder="Selecciona tu código postal"
              id="postalCode"
              search
              {...register('postalCode', validation.postalCode)}
              onChange={handleCPChange}
            />
            {errors.postalCode?.message && <InputMessage type="error" message={errors.postalCode.message} />}
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
              {...register('phone', validation.phone)}
            />
            {errors.phone && <InputMessage type="error" message={errors.phone.message ?? 'Requerido'} />}
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
    </>
  );
};

Checkout.requireAuth = true;

export default Checkout;
