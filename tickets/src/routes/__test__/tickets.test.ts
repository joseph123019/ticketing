import request from 'supertest';
import { app } from '@src/app';

const createTickets = (title: string, price: number) => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price,
    })
    .expect(201);
};

it('can fetch list of tickets', async () => {
  await createTickets('ticket1', 10);
  await createTickets('ticket2', 20);
  await createTickets('ticket3', 30);

  const response = await request(app).get('/api/tickets').send().expect(200);

  expect(response.body.length).toEqual(3);
});
