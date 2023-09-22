import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@jemtickets/common';
import { createRouter } from '@routes/create';
import { getTicketRouter } from '@routes/get';
import { ticketsRouter } from '@routes/tickets';
import { updateRouter } from '@routes/update';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(currentUser);

app.use(createRouter);
app.use(getTicketRouter);
app.use(ticketsRouter);
app.use(updateRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
