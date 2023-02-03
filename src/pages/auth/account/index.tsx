import { useSession } from 'next-auth/react';

import { trpc } from '@/utils/trpc';

import type { OrderDetails } from '@/types';
import type { User } from '@prisma/client';

import { OrderCard } from '@/components/organisms/orderCard';
import { Loader } from '@/components/molecules/loader';
import { PageContainer } from '@/components/layouts/pageContainer';
import { Header, HeaderSizes } from '@/components/atoms/header';

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
    <PageContainer header={{ title: 'Información de tu cuenta' }} className='text-center'>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Header size={HeaderSizes['2xl']} extraClassName="uppercase">
            Tus pedidos
          </Header>
          <ul>
            {orderData?.map((order) => (
              <li key={order.id}>
                <OrderCard order={order as OrderDetails} />
              </li>
            ))}
          </ul>
        </>
      )}
    </PageContainer>
  );
};

AccountDetails.requireAuth = true;

export default AccountDetails;
