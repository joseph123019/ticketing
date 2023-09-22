import mongoose, { set } from 'mongoose';
import { TicketCreatedEvent } from '@jemtickets/common';
import { TicketCreateListener } from '../ticket-created-listener';
import { natsWrapper } from '@src/nats-wrapper';
import { Message } from 'node-nats-streaming';
import { Ticket } from '@src/models/ticket';

const setup = async () => {
  // create an intance of the listener
  const listener = new TicketCreateListener(natsWrapper.client);

  // create fake data
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'concert',
    price: 100,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create fake msg
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ticket is created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket?.title).toEqual(data.title);
  expect(ticket?.price).toEqual(data.price);
});

it('acknowledge or ack the message', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
