import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../../components/common/Header';
import { logout } from '../../modules/user';

const HeaderContainer = () => {
  // 리덕스 연결
  const { user } = useSelector(({ user }) => ({
    user: user.user
  }));
  const dispatch = useDispatch();
  const onLogout = () => {
    dispatch(logout());
  }
  return <Header user={user} onLogout={onLogout} />;
};

export default HeaderContainer;