import {
  useMemo,
  useState,
  useEffect,
  useCallback
} from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { PostalCode } from '@prisma/client';
import {
  Dropdown,
  Form,
  Accordion,
  Icon,
  Message
} from 'semantic-ui-react';
import Link from 'next/link';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { useCartItems } from '@/lib/hooks/useCartItems';
import {
  checkoutDefaultValues,
  getAvailableDaysOptions,
  getScheduleOptions,
  paymentOptions,
  validation,
} from '@/lib/checkout';

import { trpc } from '@/lib/trpc';

import { PageContainer } from '@/components/layouts/pageContainer';
import { Button } from '@/components/atoms/button';
import { InputMessage } from '@/components/atoms/inputMessage';
import { RadioGroup } from '@/components/molecules/radioGroup';
import { CartItemsTable } from '@/components/molecules/cartItemsTable';
import { Searchbar } from '@/components/molecules/searchbar';
import { Pill } from '@/components/atoms/pill';

import type { ChangeEvent, MouseEvent } from 'react';
import type { DropdownProps } from 'semantic-ui-react';
import type { TableCartItem } from '../cart';
import type { CheckoutFormValues } from '@/lib/checkout';

import { PaymentMethods } from '@/types';
import { useCartActions } from '@/store/cart';

const Checkout = () => {
  const router = useRouter();

  const [activeIndex, setActiveIndex] = useState<number | undefined>(0);
  const [, setPaymentMethod] = useState<PaymentMethods>(PaymentMethods.Transfer);

  const { data: session } = useSession();
  const user = session?.user;

  const { cartItems, cartTotal } = useCartItems();
  const { clearCart } = useCartActions();
  const tableCartItems: TableCartItem[] = Object.values(cartItems).map((item) => ({
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    id: item.id,
  }));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValidating },
    setValue,
    getValues,
    setError,
    control,
    trigger,
  } = useForm({ defaultValues: checkoutDefaultValues });

  // set mail and name from session
  // remember that default values are only set on first render
  // then they must be set via setValue or reset
  useEffect(() => {
    if (user) {
      if (user.name) {
        setValue('name', user.name);
      }
      if (user.email) {
        setValue('email', user.email);
      }
    }
  }, [user, setValue]);

  // we actually want to check the selectedPostalCode, not the postalCode
  useEffect(() => {
    register('selectedPostalCode', validation.selectedPostalCode);
    register('postalCode', validation.postalCode);
  }, [register]);

  const utils = trpc.useContext();
  const successfulOrderConfirmation = trpc.order.success.useMutation();

  const { mutateAsync, isLoading: isCreating } = trpc.order.create.useMutation({
    onSuccess: async (data, _variables, _context) => {
      const { mutateAsync: successfulOrderMutate } = successfulOrderConfirmation;
      if (data?.id && data.userId) {
        await successfulOrderMutate({
          id: data.id,
          userId: data.userId,
        });
      }
      router.push(`/order/${user?.id as string}/${data?.id}`);
      clearCart();
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

  // TODO?: we may want to abstract the CP searchbar into a component
  // I don't think if its worth it right now, but in the future we may want to use it in other places
  // or just to make this page more readable and focus the code on the form
  const postalCode = getValues('postalCode');
  const chosenPostalCode = getValues('selectedPostalCode');

  const { data: fetchedPostalCodes, refetch } = trpc.postalCodes.getByCode.useQuery(
    {
      code: postalCode,
      limit: 10,
    },
    {
      enabled: !!postalCode,
      select: useCallback(
        (postalCodes: PostalCode[]) =>
          postalCodes.map(({ code, name }) => ({ id: `${code} — ${name}`, name: `${code} — ${name}` })),
        []
      ),
    }
  );

  useEffect(() => {
    if (!postalCode) return;
    refetch();
  }, [postalCode, refetch]);

  const handleCPChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value || value === '') {
      setError('postalCode', {});
      setValue('postalCode', value);
    }
  };

  const handleCPSelect = (e: MouseEvent<HTMLLIElement>) => {
    const { innerText } = e.currentTarget;
    if (innerText) {
      setError('selectedPostalCode', {});
      setValue('selectedPostalCode', innerText);
      setError('postalCode', {});
      setValue('postalCode', innerText);
    }
  };

  const handleCPUnselect = () => {
    setValue('selectedPostalCode', '');
    // force rerender and show missing field
    trigger('selectedPostalCode');
  };

  const handleAccordionOpenClose = () => {
    setActiveIndex(activeIndex === 0 ? undefined : 0);
  };

  // force rerender to show hide transfer payment
  const handlePaymentChange = (event: React.SyntheticEvent<HTMLElement, Event>) => {
    const target = event.target as HTMLInputElement;
    if (target.value) {
      setPaymentMethod(target.value as PaymentMethods);
    }
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
          payment: data.payment,
          name: data.name,
          email: data.email,
        },
        total: cartTotal,
      });
    })();

  const actionsDisabled = isCreating || isValidating || isSubmitting;

  const renderPostalPillInner = () => (
    <div className="flex items-center">
      <span className="text-sm">{chosenPostalCode}</span>
      <button
        type="button"
        className="ml-2 text-sm text-white hover:text-gray-700"
        onClick={handleCPUnselect}
        aria-label="Close"
      >
        x
      </button>
    </div>
  );

  return (
    <>
      <Head>
        {/* dont index */}
        <meta name="robots" content="noindex" />
        <title>Finalizar pedido</title>
      </Head>
      <PageContainer className="text-center" heading={{ title: 'Finalizar pedido' }}>
        <Accordion className="my-8">
          <Accordion.Title active={activeIndex === 0} index={0} onClick={handleAccordionOpenClose}>
            <Icon name="dropdown" />
            Tu pedido
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            <CartItemsTable tableItems={tableCartItems} cartTotal={cartTotal} />
          </Accordion.Content>
        </Accordion>
        <Form onSubmit={handleSubmit(handleFormSubmit)} className="px-5 text-left">
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

            {errors.selectedPostalCode?.message && (
              <InputMessage type="error" message={errors.selectedPostalCode.message} />
            )}
            <Searchbar
              onSelect={handleCPSelect}
              onChange={handleCPChange}
              placeholder="Ingresa tu código postal"
              inputType="number"
              searchResults={fetchedPostalCodes}
            />
            {chosenPostalCode ? (
              <Pill className="mt-2 bg-primary-blue text-white">{renderPostalPillInner()}</Pill>
            ) : null}
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
          {/* name */}
          <Form.Field>
            <label htmlFor="name" className="form-label font-bold">
              Nombre
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Nombre"
              id="name"
              {...register('name', validation.name)}
            />
            {errors.name && <InputMessage type="error" message={errors.name.message ?? 'Requerido'} />}
          </Form.Field>
          {/* email */}
          <Form.Field>
            <label htmlFor="email" className="form-label font-bold">
              Correo electrónico
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="Correo electrónico"
              id="email"
              {...register('email', validation.email)}
            />
            {errors.email && <InputMessage type="error" message={errors.email.message ?? 'Requerido'} />}
          </Form.Field>
          <Form.Field>
            <Controller
              name="payment"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onChange={handlePaymentChange}
                  className="flex flex-col"
                  label="Método de pago"
                  field={field}
                  options={paymentOptions}
                />
              )}
            />
            {errors.payment?.message && <InputMessage type="error" message={errors.payment.message} />}
          </Form.Field>
          {getValues('payment') === PaymentMethods.Transfer ? (
            <Message
              info
              icon="info circle"
              header="Información de transferencia"
              content="Una vez que hayas realizado tu pedido, recibirás un correo con los datos de la cuenta bancaria
               a la que debes realizar la transferencia. El pedido se enviará una vez que se haya recibido el pago."
            />
          ) : null}
          <Button variant="primary" className="btn btn-primary mt-5" type="submit" disabled={actionsDisabled}>
            {actionsDisabled ? 'Generando pedido...' : 'Confirmar pedido'}
          </Button>
          <div className="mt-10">
            <Link href="/cart">
              <Button variant="secondary" className="btn btn-secondary mt-5" disabled={actionsDisabled}>
                Regresa
              </Button>
            </Link>
          </div>
        </Form>
      </PageContainer>
    </>
  );
};

Checkout.requireAuth = true;

export default Checkout;
