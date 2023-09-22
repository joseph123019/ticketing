import express, { Request, Response } from 'express';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@jemtickets/common';
import { Order, OrderStatus } from '@src/models/order';
import { natsWrapper } from '@src/nats-wrapper';
import { OrderCancelledPublisher } from '@src/events/publishers/order-cancelled-publisher';

const router = express.Router();

router.patch(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
      version: order.version,
    });

    res.send(order);
  }
);

export { router as deleteOrderRouter };
