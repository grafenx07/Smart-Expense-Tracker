import axios from 'axios';

const client = axios.create({
  baseURL: '/expenses',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
});

export default client;
