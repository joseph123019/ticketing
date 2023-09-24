import Link from 'next/link';

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sell Tickets', href: '/tickets/new' },
    currentUser && { label: 'My Orders', href: '/orders' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ].filter((linkConfig) => linkConfig);

  return (
    <header className="bg-gray-900 text-white">
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <span className="text-2xl font-semibold cursor-pointer">
              Ticketing
            </span>
          </Link>

          <nav>
            <ul className="flex space-x-4">
              {links.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href}>
                    <span className="hover:text-blue-500 cursor-pointer">
                      {label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
