import { useRouter } from 'next/router';

import { PageContainer } from '@/components/layouts/pageContainer';
import { trpc } from '@/utils/trpc';
import { Loader } from '@/components/molecules/loader';
import { ProductItem } from '@/components/molecules/productItem';
import { OrderCard } from '@/components/organisms/orderCard';

// this page is deprecated (?)
const OrderConfirmDetail = () => {
  const router = useRouter();
  const { orderId } = router.query;

  const { data, isLoading } = trpc.order.getById.useQuery(
    { id: orderId as string },
    {
      enabled: !!orderId && typeof orderId === 'string',
    }
  );

  return (
    <PageContainer heading={{ title: 'Historial de pedidos'}}>
      <div className='px-6'>
        {isLoading && <Loader />}
        {data && (
          <div className="mb-10">
            <OrderCard order={data} />
          </div>
        )}
        {data?.orderItems.map((orderItem) => (
          <ProductItem
            key={orderItem.id}
            name={orderItem.product.name}
            price={orderItem.product.price}
            description={orderItem.product.description}
            image={orderItem.product.image}
            id={orderItem.product.id}
            qty={orderItem.quantity}
            showCTAs={false}
            allowDetailsRedir
          />
        ))}
      </div>
    </PageContainer>
  );
};

OrderConfirmDetail.requireAuth = true;

export default OrderConfirmDetail;
