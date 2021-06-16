import client from './client';


export const writePost = ({ title, body, tags }) => {
  console.log('lib/api/posts writePost API')
  return client.post('/api/posts', { title, body, tags });
}