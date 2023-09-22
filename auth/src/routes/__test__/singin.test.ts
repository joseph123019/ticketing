import request from 'supertest';
import { app } from '@src/app';

it('fails when a email does not exists is supplied', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'email@example.com',
      password: 'examplepassword',
    })
    .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'email@example.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'email@example.com',
      password: 'password1',
    })
    .expect(400);
});

it('register and check if the login works', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'email@example.com',
      password: 'examplepassword',
    })
    .expect(201);

  const result = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'email@example.com',
      password: 'examplepassword',
    })
    .expect(200);

  expect(result.get('Set-Cookie')).toBeDefined();
});
