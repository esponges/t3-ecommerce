import { useSession } from "next-auth/react";

import { trpc } from "@/utils/trpc";

import type { OrderDetails } from "@/types";
import type { User } from "@prisma/client";

import { OrderCard } from "@/components/organisms/orderCard";
import { Loader } from "@/components/molecules/loader";

const AccountDetails = () => {
  const { data: session } = useSession();
  const user: User | undefined = session?.user as User | undefined;
  
  const { data: orderData, isLoading } = trpc.order.getByUserId.useQuery({
    userId: user?.id,
    orderItemDetails: true,
  }, {
    enabled: !!user?.id,
  });

  return (
    <div className="my-10 mx-auto md:w-1/2">
      <h1 className="mb-10">Account Details</h1>
      <h2>Orders</h2>
      <ul>
        {isLoading && <Loader />}
        {orderData?.map((order) => (
          <li key={order.id}>
            <OrderCard
              order={order as OrderDetails}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccountDetails;
