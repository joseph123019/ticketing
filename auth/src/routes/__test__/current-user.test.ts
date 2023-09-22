import request from 'supertest';
import { app } from '@src/app';

it('should response with details of the user logged in', async () => {
  const cookie = await global.signin();

  const result = await request(app)
    .get('/api/users/current_user')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(result.body.currentUser.email).toEqual('email@example.com');
});
