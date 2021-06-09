import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeField, initializeForm } from '../../modules/auth.js';
import AuthForm from '../../components/auth/AuthForm.js'

const RegisterForm = () => {
  const dispatch = useDispatch();
  const { form } = useSelector (({ auth }) => ({
    form: auth.register
  }));
  
  // 인풋 변경 이벤트 핸들러
  const onChange = e => {
    const { value, name } = e.target;
    dispatch(
      changeField({
        form: 'register',
        key: name,
        value: value
      })  
    );
  };


  const onSubmit = e => {
    e.preventDefault();
  };
  
  // 컴포너트가 처음 렌더링 될 때 form을 초기화
  useEffect(() => {
    dispatch(initializeForm('register'));
  }, [dispatch]);

console.log('src/containers/auth/RegisterForm');
  return (
    <AuthForm
      type="register"
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
};

export default RegisterForm;