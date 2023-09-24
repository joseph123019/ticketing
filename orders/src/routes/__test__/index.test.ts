import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '@src/app';
import { Ticket } from '@src/models/ticket';

const createTicket = async (title: string, price: number) => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    id: ticketId,
    title,
    price,
  });
  await ticket.save();

  return ticket;
};

it('fetches orders for an particular user', async () => {
  // Create three tickets
  const ticketOne = await createTicket('concert1', 20);
  const ticketTwo = await createTicket('concert2', 30);
  const ticketThree = await createTicket('concert3', 40);

  const userOne = global.signin();
  const userTwo = global.signin();

  // create one order as user1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);
  // create two orders as user2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  // make request to get orders for user2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);
  // make sure we only get the orders for user2
  expect(response.body.length).toEqual(2);
});
