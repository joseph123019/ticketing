import mongoose from 'mongoose';
import { natsWrapper } from '@src/nats-wrapper';
import { OrderCancelledEvent } from '@jemtickets/common';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { Ticket } from '@src/models/tickets';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: 'concert',
    price: 1000,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  ticket.set(orderId);
  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
    version: 0,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, orderId, ticket, data, msg };
};

it('update the ticket, publish it and ack the msg', async () => {
  const { listener, data, ticket, orderId, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket?.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
