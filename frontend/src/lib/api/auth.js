import client from './client';

// 로그인
export const login = ({ username, password }) => {
  return client.post('/api/auth/login', { username, password });
};

// 회원가입, MongoDB와 다르게 return을 해줘야 frontend/src/lib/createRequestSag에서 response를 받아 data에 값을 넣어주게 된다 => ID를 반환
export const register = ({ username, password }) => {
  return client.post('/api/auth/register', {username, password});
  // 하다 잘 모르겠으면 console.log찍어보면 딹 나옴
};

// 로그인 상태 확인
export const check = () => {
  return client.get('/api/auth/check');
}

// 로그아웃
export const logout = () => {
  return client.post('/api/auth/logout');
}