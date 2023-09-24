import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on the server

    // Disable SSL certificate verification (not recommended for production)
    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    return axios.create({
      baseURL: 'http://www.ticketing.sepingel.com',
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseURL: '/',
    });
  }
};
