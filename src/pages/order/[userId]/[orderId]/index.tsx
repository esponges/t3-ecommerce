/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { Card, Message } from 'semantic-ui-react';
import Head from 'next/head';

import type { OrderDetails as IOrderDetails } from '@/types';

import { trpc } from '@/lib/trpc';
import { env } from '@/env/client.mjs';

import type { TableCartItem } from '@/pages/cart';
import { PageContainer } from '@/components/layouts/pageContainer';
import { Label } from '@/components/atoms/label';
import { CartItems } from '@/components/molecules/cartItems';
import { Button } from '@/components/atoms/button';

const OrderDetails = () => {
  const router = useRouter();
  const { userId, orderId } = router.query;

  const { data: order, isLoading } = trpc.order.getById.useQuery(
    {
      id: orderId as string,
    },
    {
      enabled: !!orderId && !!userId,
      select: useCallback((order: IOrderDetails) => {
        return {
          ...order,
          orderItems: order.orderItems.map((orderItem) => ({
            name: orderItem.product.name,
            price: orderItem.product.price,
            quantity: orderItem.quantity,
          })),
        };
      }, []),
    }
  );

  const header = {
    title: 'Detalles de tu pedido',
  };

  // todo: match userId with orderId
  if (!userId || !orderId) {
    return (
      <PageContainer verticallyCentered>
        <Message
          error
          header="Error"
          content="No logramos encontrar la orden que buscas. Probablemente pertenece a otra cuenta."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer verticallyCentered className="mb-5" heading={header}>
      <Head>
        {/* dont index */}
        <meta name="robots" content="noindex" />
        <title>Tu pedido</title>
      </Head>
      <Card className="order-success-card mb-5 md:w-1/2">
        <Card.Content className="md:w-full">
          {isLoading && <p>Loading...</p>}
          {order && (
            <div>
              <Label className="mb-2">Id del pedido</Label>
              <p className="mt-4">{order.id}</p>
              <Label className="mb-2">Total</Label>
              <p className="mt-4">${order.total} MXN</p>
              <Label className="mb-2">Productos</Label>
              <CartItems tableItems={order.orderItems as TableCartItem[]} cartTotal={order.total as number} />
              {order.orderDetail?.payment === 'transfer' ? (
                <div className="my-5 border border-gray-300 p-5">
                  <p className="mb-2">
                    Para poderte enviar tu pedido, por favor realiza el pago a la siguiente cuenta bancaria:
                  </p>
                  <p className="mb-2">
                    Banco:
                    <b className="ml-3">{env.NEXT_PUBLIC_BANK_NAME}</b>
                  </p>
                  <p className="mb-2">
                    CLABE:
                    <b className="ml-3">{env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER}</b>
                  </p>
                  <p className="mb-2">
                    Nombre:
                    <b className="ml-3">{env.NEXT_PUBLIC_BANK_ACCOUNT_NAME}</b>
                  </p>
                </div>
              ) : null}
              <Label className="mb-2">Dirección</Label>
              <p className="mt-4">
                {`
                ${order.orderDetail?.address || ''}, 
                ${order.orderDetail?.city || ''},  
                ${order.orderDetail?.postalCode || ''}
              `}
              </p>
              <Label className="mb-2">Entrega</Label>
              <p className="mt-4">
                {`
                ${order.orderDetail?.day || ''},
                ${order.orderDetail?.schedule || ''}
              `}
              </p>
            </div>
          )}
        </Card.Content>
        <Button onClick={() => router.push('/')} className="w-full md:w-auto" variant="primary">
          Regresar al inicio
        </Button>
      </Card>
    </PageContainer>
  );
};

OrderDetails.requireAuth = true;

export default OrderDetails;
