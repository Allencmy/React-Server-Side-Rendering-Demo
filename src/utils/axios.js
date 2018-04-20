import axios from 'axios';

axios.defaults.baseURL = `http://127.0.0.1:3001/`;

export const get = axios.get;
export const post = axios.post;
export const put = axios.put;
export default axios;
