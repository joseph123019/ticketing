import { Ticket } from '../tickets';

it('implements optimistic concurrency controll', async () => {
  // create intance of ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: 'qweqweqwe',
  });

  // save the ticket to the database
  await ticket.save();

  // fetch twice
  const firstTicket = await Ticket.findById(ticket.id);
  const secondTicket = await Ticket.findById(ticket.id);

  // create two separate changes to ticket
  firstTicket?.set({ price: 100 });
  secondTicket?.set({ price: 200 });

  // save the first ticket
  await firstTicket?.save();

  // get error save the second ticket that has an outdated version number
  try {
    await secondTicket?.save();
  } catch (error) {
    return;
  }
});

it('increments the version number on multiples saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: 'qweqweqwe',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
