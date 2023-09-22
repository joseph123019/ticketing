import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  RequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@jemtickets/common';
import { stripe } from '@src/stripe';
import { PaymentCreatedPublisher } from '@src/events/publishers/payment-created-publisher';
import { Order } from '@src/models/order';
import { Payment } from '@src/models/payment';
import { natsWrapper } from '@src/nats-wrapper';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new RequestError('Order is cancelled');
    }

    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });
    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });
    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: charge.id,
    });

    res.status(201).send(payment);
  }
);

export { router as createChargeRouter };
