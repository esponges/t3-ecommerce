import { trpc } from '@/utils/trpc';

const Orders = () => {
  const { data } = trpc.order.getAll.useQuery();

  return (
    <div>
      <h1>Orders</h1>
      <ul>
        {data?.map((order) => (
          <li key={order.id}>
            <p>{order.id}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
