import request from 'supertest';
import { app } from '@src/app';
import mongoose from 'mongoose';

it('returns a 404 if the ticket is not exists', async () => {
  const id = new mongoose.Types.ObjectId();
  return await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('returns ticket if the ticket is exists', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'qweqweqweq',
      price: 10,
    })
    .expect(201);
  return await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);
});
