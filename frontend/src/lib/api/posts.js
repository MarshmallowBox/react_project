import client from './client';


export const writePost = ({ title, body, tags }) => {
  console.log('lib/api/posts writePost API');
  return client.post('/api/posts', { title, body, tags });
};

export const readPost = postnum => {
  console.log('lib/api/posts readPost API');
  return client.get(`/api/posts/${postnum}`,)
};