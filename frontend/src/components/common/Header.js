import React from 'react';
import styled from 'styled-components';
import Responsive from './Responsive';
import { Link } from 'react-router-dom';
import Button from './Button';

const HeaderBlock = styled.div`
  position: fixed;
  width: 100%;
  background: white;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
`;

// Responsive 컴포넌트의 속성에 스타일을 추가해서 새로운 컴포넌트 생성
const Wrapper = styled(Responsive)`
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .logo {
    font-size: 1.125rem;
    font-weight: 800;
    letter-spring: 2px;
  }
  
  .right {
    display: flex;
    align-items: center;
  }
`;

// 헤더가 fixed로 되어있기 때문에 페이지의 콘텐츠가 아래에 나타나도록 해 주는 컴포넌트
const Spacer = styled.div`
  height: 3rem;
`;

const UserInfo = styled.div`
  font-weight: 800;
  margin-right: 1rem;
`;

const Header = ({ user, onLogout }) => {
  return (
    <>
      <HeaderBlock>
        <Wrapper>
          <Link to="/post" className="logo">Doya Log</Link>
          <div className="right">
          {user ? (
            <div className="right">
              <UserInfo>{user.username}</UserInfo>
              <Button onClick={onLogout}>로그아웃</Button>
            </div>
          ) : (
            <div className="right">
              <Button to="/login">로그인</Button>
            </div>
          )}
          </div>
        </Wrapper>
      </HeaderBlock>
      <Spacer />
    </>
  );
};

export default Header;