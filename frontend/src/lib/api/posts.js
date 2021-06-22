import client from './client';
import qs from 'qs';

export const writePost = ({ title, body, tags, publishedDate }) => {
  console.log('lib/api/posts writePost API');
  return client.post('/api/posts', { title, body, tags, publishedDate});
};

export const readPost = postnum => {
  console.log('lib/api/posts readPost API');
  return client.get(`/api/posts/${postnum}`,)
};

// Ex) /api/posts?username=tester&page=2
export const listPosts = ({ page,username, tag}) => {
  const queryString = qs.stringify({
    page,
    username,
    tag,
  });
  return client.get(`/api/posts?${queryString}`);
}