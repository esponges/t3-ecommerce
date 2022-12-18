import { useSession } from "next-auth/react";

import { trpc } from "@/utils/trpc";
import type { User } from "@prisma/client";

const AccountDetails = () => {
  const { data: session } = useSession();
  const user: User | undefined = session?.user as User | undefined;
  
  const { data } = trpc.order.getByUserId.useQuery({
    userId: user?.id,
  }, {
    enabled: !!user?.id,
  });

  return (
    <div>
      <h1>Account Details</h1>
      <p>Orders</p>
      <ul>
        {data?.map((order) => (
          <li key={order.id}>
            {order.id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccountDetails;
