import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  return (
    <div className="flex justify-center items-start h-screen">
      <div className="bg-white shadow-md p-6 rounded-lg">
        <h1 className="text-2xl font-semibold mb-4">{ticket.title}</h1>
        <h4 className="text-lg font-medium">
          Price: ${ticket.price.toFixed(2)}
        </h4>
        {errors && <div className="text-red-500 mt-4">{errors}</div>}
        <button
          onClick={() => doRequest()}
          className="mt-4 bg-indigo-600 text-white font-semibold py-2 px-4 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Purchase
        </button>
      </div>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;
