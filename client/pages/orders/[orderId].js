import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div className="flex justify-center items-start h-screen h-screen">
      <div className="text-center">
        <div className="mb-4">Time left to pay: {timeLeft} seconds</div>
        <div className="mb-4">
          <div className="flex justify-center items-start h-screen">
            <StripeCheckout
              token={({ id }) => doRequest({ token: id })}
              stripeKey="pk_test_51L5HPCB9ZSqjdeJc7w3VSVfzwSJKfZDodhO7lrwB2RUNkn5w4sKMCHhcvigkMOPP2fLMVWFwch85qKwUNfypBjJZ00iFFYIys2"
              amount={order.ticket.price * 100}
              email={currentUser.email}
            />
          </div>
        </div>
        {errors}
      </div>
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
