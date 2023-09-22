import request from 'supertest';
import { app } from '@src/app';
import { response } from 'express';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'email@example.com',
      password: 'examplepassword',
    })
    .expect(201);
});

it('returns 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'emailexample.com',
      password: 'examplepassword',
    })
    .expect(400);
});

it('returns 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'emaile@xample.com',
      password: 'fail',
    })
    .expect(400);
});

it('returns 400 with an missing email and password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: '',
      password: '',
    })
    .expect(400);
});

it('check duplicate email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'email@example.com',
      password: 'examplepassword',
    })
    .expect(201);

  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'email@example.com',
      password: 'examplepassword',
    })
    .expect(400);
});

it('set cookie after successful signup', async () => {
  const result = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'email@example.com',
      password: 'examplepassword',
    })
    .expect(201);

  expect(result.get('Set-Cookie')).toBeDefined();
});
