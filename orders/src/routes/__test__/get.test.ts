import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '@src/app';
import { Ticket } from '@src/models/ticket';

it('fetch order', async () => {
  // create ticket
  const userId = new mongoose.Types.ObjectId().toHexString();
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    id: ticketId,
    title: 'concert',
    price: 20,
    userId,
  });
  await ticket.save();

  const user = global.signin(userId);

  // make request to create order with the ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make request to fetch the order
  const { body: userOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(userOrder.id).toEqual(order.id);
});

it('return error if user fetch other user order', async () => {
  // create ticket
  const userId = new mongoose.Types.ObjectId().toHexString();
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    id: ticketId,
    title: 'concert',
    price: 20,
    userId,
  });
  await ticket.save();

  const user = global.signin(userId);
  const wrongUser = global.signin();

  // make request to create order with the ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make request to fetch the order
  const { body: userOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', wrongUser)
    .send()
    .expect(401);
});
