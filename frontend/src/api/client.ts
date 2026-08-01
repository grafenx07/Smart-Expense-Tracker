import axios from 'axios';

const apiBase = import.meta.env.VITE_API_URL || '';
const client = axios.create({
  baseURL: apiBase ? `${apiBase.replace(/\/$/, '')}/expenses` : '/expenses',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
});

export default client;

