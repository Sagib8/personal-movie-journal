import axios from 'axios';
// a connection to the back
const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

export default api;