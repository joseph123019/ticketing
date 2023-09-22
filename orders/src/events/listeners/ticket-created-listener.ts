import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@jemtickets/common';
import { Ticket } from '@src/models/ticket';
import { queueGroupName } from './queue-group-name';
export class TicketCreateListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}
