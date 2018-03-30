import axios from 'axios';

axios.defaults.baseURL = 'http://test.aaronmao.me';

if (['test', 'production'].indexOf(process.env.NODE_NEV) > -1) {
  const hostname = `${process.env.NODE_NEV === 'production' ? '' : 'test.'}college.careerfrog.com.cn`;
  axios.defaults.baseURL = `http://127.0.0.1:${process.env.PORT}/`;
  axios.defaults.headers.common['Host'] = hostname;
}

if (global.window) {
  axios.defaults.baseURL = window.location.origin;
}
// axios.defaults.baseURL = `http://127.0.0.1:${process.env.PORT}/`;
export const get = axios.get;
export const post = axios.post;
export const put = axios.put;
export default axios;
