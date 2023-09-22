import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@jemtickets/common';

import { indexOrderRouter } from '@src/routes/index';
import { createOrderRouter } from '@src/routes/create';
import { deleteOrderRouter } from '@src/routes/delete';
import { getOrderRouter } from '@src/routes/get';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);

app.use(indexOrderRouter);
app.use(createOrderRouter);
app.use(deleteOrderRouter);
app.use(getOrderRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
