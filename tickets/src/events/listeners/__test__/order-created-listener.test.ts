import mongoose, { version } from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from '@jemtickets/common';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '@src/nats-wrapper';
import { Ticket } from '@src/models/tickets';

const setup = async () => {
  // create an intance of listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create a ticket
  const ticket = Ticket.build({
    title: 'Concert',
    price: 1000,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  // create fake data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: 'asdsadasd',
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

  return { listener, ticket, data, msg };
};

it('set userId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket?.orderId).toEqual(data.id);
});

it('ack the mesg', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publish ticket updated event', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
