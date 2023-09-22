import request from 'supertest';
import { app } from '@src/app';

it('check if signout works', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'email@example.com',
      password: 'examplepassword',
    })
    .expect(201);

  const result = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);

  expect(result.get('Set-Cookie')).toBeDefined();
});
