import axios from 'axios';
import https from 'https';

export default ({ req }) => {
  // Determine if the code is running on the server
  const isServer = typeof window === 'undefined';

  if (isServer) {
    // We are on the server
    const axiosInstance = axios.create({
      baseURL:
        'https://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });

    // Configure axios instance to reject invalid SSL certificates
    axiosInstance.defaults.httpsAgent = new https.Agent({
      rejectUnauthorized: true, // Enable SSL certificate verification
    });

    return axiosInstance;
  } else {
    // We must be on the browser
    return axios.create({
      baseURL: '/',
    });
  }
};
