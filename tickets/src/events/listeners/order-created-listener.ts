import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@jemtickets/common';
import { queueGroupName } from './queueGroupName';
import { Ticket } from '@src/models/tickets';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // find the ticket that has an order
    const ticket = await Ticket.findById(data.ticket.id);

    // if no ticket throw error
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // mark the ticket is being reserved by setting the orderId property
    ticket.set({ orderId: data.id });

    // save the ticket
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.id,
      version: ticket.version,
    });
    // ack the msg
    msg.ack();
  }
}
