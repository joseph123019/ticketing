import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@jemtickets/common';
import { Ticket } from '@src/models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdateListener extends Listener<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    const { title, price } = data;

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}
