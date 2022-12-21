import { useRouter } from "next/router";

import { PageContainer } from "@/components/layouts/pageContainer";
import { trpc } from "@/utils/trpc";
import { Loader } from "@/components/molecules/loader";

const OrderConfirmDetail = () => {
  const router = useRouter();
  const { orderId } = router.query;

  const { data, isLoading } = trpc.order.getById.useQuery({ id: orderId as string }, {
    enabled: !!orderId && typeof orderId === 'string',
  });

  console.log('data', data);

  return (
    <PageContainer> 
      {isLoading && <Loader />}
      <h1>Order Confirm Detail</h1>
      <p>Order ID: {orderId}</p>
    </PageContainer>
  );
};

export default OrderConfirmDetail;
