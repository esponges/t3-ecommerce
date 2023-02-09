import { useSession } from 'next-auth/react';

import { trpc } from '@/utils/trpc';

import type { OrderDetails } from '@/types';
import type { User } from '@prisma/client';

import { OrderCard } from '@/components/organisms/orderCard';
import { Loader } from '@/components/molecules/loader';
import { PageContainer } from '@/components/layouts/pageContainer';
import { Heading, HeadingSizes } from '@/components/atoms/heading';
import { Message } from 'semantic-ui-react';

const AccountDetails = () => {
  const { data: session } = useSession();
  const user: User | undefined = session?.user as User | undefined;

  const { data: orderData, isLoading } = trpc.order.getByUserId.useQuery(
    {
      userId: user?.id,
      orderItemDetails: true,
    },
    {
      enabled: !!user?.id,
    }
  );

  return (
    <PageContainer heading={{ title: 'Información de tu cuenta' }} className="text-center">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Heading size={HeadingSizes['2xl']} className="uppercase">
            Tus pedidos
          </Heading>
          <ul>
            {!!orderData?.length ? (
              orderData?.map((order) => (
                <li key={order.id}>
                  <OrderCard order={order as OrderDetails} />
                </li>
              ))
            ) : (
              <Message
                info
                Heading="No tienes pedidos"
                content="Puedes ver los productos que tenemos disponibles en la página principal"
              />
            )}
          </ul>
        </>
      )}
    </PageContainer>
  );
};

AccountDetails.requireAuth = true;

export default AccountDetails;
