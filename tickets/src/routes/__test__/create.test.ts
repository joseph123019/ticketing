import request from 'supertest';
import { app } from '@src/app';
import { Ticket } from '@models/tickets';
import { natsWrapper } from '@src/nats-wrapper';

it('should route handler listening to /api/tickets for post request and should have cookie to be accessed', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in then create a ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'qweqweqweq',
      price: 10,
    })
    .expect(201);

  let tickets = await Ticket.find();
  expect(tickets.length).toEqual(1);
});

it('should return an error if an invalid title is provided', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
    });

  expect(response.status).toEqual(400);
});

it('should return an error if an invalid title is provided', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '123qweqe123123',
    });

  expect(response.status).toEqual(400);
});

it('Publishes an event', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'qweqweqweq',
      price: 10,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
