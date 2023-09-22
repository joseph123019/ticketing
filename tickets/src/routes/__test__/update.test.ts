import request from 'supertest';
import { app } from '@src/app';
import mongoose from 'mongoose';
import { natsWrapper } from '@src/nats-wrapper';
import { Ticket } from '@src/models/tickets';

const createTickets = (title: string, price: number, cookie: any) => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', cookie ? cookie : global.signin())
    .send({
      title,
      price,
    })
    .expect(201);
};

it('success update ticket', async () => {
  const cookie = global.signin();
  const response = await createTickets('ticket1', 10, cookie);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'newticket1',
      price: 200,
    })
    .expect(200);

  const getTicket = await request(app).get(`/api/tickets/${response.body.id}`);

  expect(getTicket.body.title).toEqual('newticket1');
  expect(getTicket.body.price).toEqual(200);
});

it('returns 404 if the provided id is not exists', async () => {
  const id = new mongoose.Types.ObjectId();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: '123213123',
      price: 20,
    })
    .expect(404);
});

it('returns 401 if the user is not authenticated', async () => {
  const response = await createTickets('ticket1', 10, false);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .send({
      title: 'newticket1',
      price: 200,
    })
    .expect(401);
});

it('returns 401 if the user not own the ticket', async () => {
  const response = await createTickets('ticket1', 10, false);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'newticket1',
      price: 200,
    })
    .expect(401);
});

it('returns 400 if the user provide invalid title or price', async () => {
  const cookie = global.signin();
  const response = await createTickets('ticket1', 10, cookie);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 200,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'asdasd',
      price: -200,
    })
    .expect(400);
});

it('Publishes an event', async () => {
  const cookie = global.signin();
  const response = await createTickets('ticket1', 10, cookie);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'newticket1',
      price: 200,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('reject update if the ticket is reserved', async () => {
  const cookie = global.signin();
  const response = await createTickets('ticket1', 10, cookie);

  const ticket = await Ticket.findById(response.body.id);
  ticket?.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket?.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'concert',
      price: 200,
    })
    .expect(400);
});
