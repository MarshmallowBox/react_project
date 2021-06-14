import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { changeField, initializeForm, login } from '../../modules/auth.js';
import AuthForm from '../../components/auth/AuthForm.js'
import { check } from '../../modules/user';

const LoginForm = ({ history }) => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { form, auth, authError, user } = useSelector (({ auth, user }) => ({
    form: auth.login,
    auth: auth.auth,
    authError: auth.authError,
    user: user.user,
  }));
  
  // 인풋 변경 이벤트 핸들러
  const onChange = e => {
    const { value, name } = e.target;
    dispatch(
      changeField({
        form: 'login',
        key: name,
        value: value
      })  
    );
  };

  const onSubmit = e => {
    e.preventDefault();
    const { username, password } = form;
    dispatch(login({ username, password }));
  };
  
  // 컴포너트가 처음 렌더링 될 때 form을 초기화
  useEffect(() => {
    dispatch(initializeForm('login'));
  }, [dispatch]);
  
  // 로그인 이전 후 auth값 확인
  useEffect(() => {
    if (authError) {
      console.log('오류 발생');
      console.log(authError);
      setError('로그인 실패');
      return;
    }
    if (auth) {
      console.log('로그인 성공');
      dispatch(check());
    }
  }, [auth, authError, dispatch]);
  
  // 로그인 이후 메인 페이지로 이동
  useEffect (() => {
    if (user) {
      history.push('/');
      try {
        localStorage.setItem('user', JSON.stringify(user));
      } catch(e) {
        console.log('localStorage is not working');
      }
    }
  }, [history, user]);
  
  console.log('src/containers/auth/LoginForm');
  return (
    <AuthForm
      type="login"
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
      error={error}
    />
  );
};

export default withRouter(LoginForm);

// api 사용할 때 modules.auth 에 있는 login을 받아오고, onSubmit 안에 form(username, password)을 받아오고, dispatch한다
// 그리고 useEffect에서 authError, auth를 체크하고 store안에 있는 user값에 데이터가 쌓이면 history.push를 이용하여 메인페이지로 이동