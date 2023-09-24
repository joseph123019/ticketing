const OrderIndex = ({ orders }) => {
  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id} className="mb-2">
            <span className="text-lg font-medium">{order.ticket.title}</span> -{' '}
            {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders');
  return { orders: data };
};

export default OrderIndex;
