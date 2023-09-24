import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
  const getRandomDarkColor = () => {
    const letters = '456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 10)];
    }
    return color;
  };

  const cardWidth = '200px'; // Set the fixed card width here
  const cardMinWidth = '150px'; // Set the minimum card width here

  const ticketList = tickets.map((ticket) => {
    const randomDarkColor = getRandomDarkColor();
    const randomColor = `${randomDarkColor}66`; // Add some transparency to the color
    return (
      <div
        key={ticket.id}
        className="max-w-md mx-auto mb-8"
        style={{ width: cardWidth, minWidth: cardMinWidth }} // Set fixed and minimum width for the card
      >
        <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
          <span className="block group">
            <div
              className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-transform transform hover:scale-105"
              style={{
                borderColor: randomColor,
              }}
            >
              <div
                className="h-4"
                style={{
                  backgroundColor: randomDarkColor,
                }}
              ></div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {ticket.title}
                </h2>
                <p className="text-gray-600 text-sm">
                  Price: ${ticket.price.toFixed(2)}
                </p>
                <div className="mt-4">
                  <span className="text-indigo-600 font-semibold">
                    View Details
                  </span>
                </div>
              </div>
            </div>
          </span>
        </Link>
      </div>
    );
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 mx-auto">Tickets</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {ticketList}
      </div>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

export default LandingPage;
