import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '@src/app';
import { Ticket } from '@src/models/ticket';
import { Order, OrderStatus } from '@src/models/order';
import { natsWrapper } from '@src/nats-wrapper';

it('cancel order', async () => {
  // create ticket
  const userId = new mongoose.Types.ObjectId().toHexString();
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    id: ticketId,
    title: 'concert',
    price: 100,
    userId,
  });
  await ticket.save();

  const user = global.signin(userId);

  // make requet to create an Order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // request to cancel the order
  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  const cancelledOrder = await Order.findById(order.id);

  expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits order cancelled event', async () => {
  // create ticket
  const userId = new mongoose.Types.ObjectId().toHexString();
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    id: ticketId,
    title: 'concert',
    price: 100,
    userId,
  });
  await ticket.save();

  const user = global.signin(userId);

  // make requet to create an Order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // request to cancel the order
  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
