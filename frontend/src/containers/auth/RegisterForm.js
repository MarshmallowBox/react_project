import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeField, initializeForm, register } from '../../modules/auth.js';
import AuthForm from '../../components/auth/AuthForm.js'
import { check } from '../../modules/user';
import { withRouter } from 'react-router-dom';

const RegisterForm = ({ history }) => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { form, auth, authError, user } = useSelector (({ auth, user }) => ({
    form: auth.register,
    auth: auth.auth,
    authError: auth.authError,
    user: user.user
  }));
  
  // 인풋 변경 이벤트 핸들러
  const onChange = e => {
    const { value, name } = e.target;
    dispatch(changeField({ form: 'register', key: name, value: value }));
  };

  // 폼 이벤트 등록 핸들러
  const onSubmit = e => {
    e.preventDefault();
    const { username, password, passwordConfirm} = form;
    
    // 하나라도 비어 있다면
    if([username, password, passwordConfirm].includes('')) {
      setError('빈 칸을 모두 입력해주세요');
      return;
    }
    
    // 비밀번호가 일치하지 않는다면
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      dispatch(changeField({ form: 'register', key: 'password', value: '' }));
      dispatch(changeField({ form: 'register', key: 'passwordConfirm', value: '' }));
    }
    
    if (password !== passwordConfirm) {
      return;
    }
    dispatch(register({ username, password }));
  };
  
  // 컴포너트가 처음 렌더링 될 때 form을 초기화
  useEffect(() => {
    dispatch(initializeForm('register'));
  }, [dispatch]);
  
  // 회원가입 성공/실패 처리
  useEffect(() => {
    if (authError){
      //계정명이 이미 존재할 때
      if ( authError.response.status === 409) {
        setError('이미 존재하는 계정명입니다.');
        return;
      }
      // 기타 이유
      setError('회원가입 실패');
      console.log('회원가입 오류 발생!');
      console.log(authError);
      return;
    }
    if (auth) {
      console.log('회원가입 성공!');
      console.log(auth);
      dispatch(check());
    }
  }, [auth, authError, dispatch]);

// user 값이 잘 설정되었는지 확인
useEffect(() => {
  if (user) {
    console.log('check API 성공');
    console.log(user);
    console.log(history);
    history.push('/')
    console.log(history);
    try { 
      localStorage.setItem('user', JSON.stringify(user)); 
    } catch (e) {
      console.log('localStorage is not working'); 
    }
  }
}, [history, user]);

console.log('src/containers/auth/RegisterForm');
  return (
    <AuthForm
      type="register"
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
      error={error}
    />
  );
};

// 홈 화면으로 라우트를 이동하기 위해 history를 받아 useEffect안에 history.push('/') 사용
export default withRouter(RegisterForm);