import type { User } from '@prisma/client';
import type { OrderDetails } from '@/types';
import { getOrderTotal } from '@/lib/order';

interface Props {
  order: OrderDetails;
  user?: User;
}

export const OrderCard = ({ order, user }: Props) => {
  const products = order.orderItems.map((item) => item.product);
  const total = getOrderTotal(products);

  return (
    <div className="my-2 rounded-lg bg-white p-4 shadow-md">
      <div className="flex justify-between">
        <p className="text-gray-500">Order ID: {order.id}</p>
      </div>
      <div className="flex justify-between">
        <p className="text-gray-500">Customer: {user?.name}</p>
        <p className="text-gray-500">Total: {total}</p>
      </div>
    </div>
  );
};
