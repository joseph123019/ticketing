import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '@src/app';
import { Order } from '@src/models/order';
import { Ticket } from '@src/models/ticket';
import { OrderStatus } from '@src/models/order';
import { natsWrapper } from '@src/nats-wrapper';

it('returns an error if the ticket is not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      ticketId,
    })
    .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const ticketId = new mongoose.Types.ObjectId();
  const ticket = Ticket.build({
    title: 'Twice Concert',
    price: 20,
    id: String(ticketId),
    userId,
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: 'qweqweqweqwe',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const userId2 = new mongoose.Types.ObjectId().toHexString();
  const ticketId = new mongoose.Types.ObjectId();
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20,
    id: String(ticketId),
    userId,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin(userId2))
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('emits an order created event', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const userId2 = new mongoose.Types.ObjectId().toHexString();
  const ticketId = new mongoose.Types.ObjectId();
  const ticket = Ticket.build({
    title: 'Concert',
    price: 20,
    id: String(ticketId),
    userId,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin(userId2))
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
