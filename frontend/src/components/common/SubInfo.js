//  componets/posts/PostList.js와 components/post/PostViewer.js에서 사용한 SubInfo컴포넌트 리팩토링
import React from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import palette from '../../lib/styles/palette';


const SubInfoBlock = styled.div`
  ${props =>
    props.hasMarginTop &&
    css`
      margin-top: 1rem;
    `}
  color: ${palette.gray[6]};

/* span 사이에 가운뎃점 문자 보여 주기 */
  span + span:before {
    color: ${palette.gray[4]};
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    content: '\\B7'; /* 가운뎃점 문자 */
  }
`;

// hasMarginTop 값이 true이면 상단 여백을 주고, 그렇지 않으면 여백이 없음
const SubInfo = ({ username, publishedDate, hasMarginTop }) => {
  return (
    <SubInfoBlock hasMarginTop={hasMarginTop}>
      <span>
        <b>
          <Link to={`/${username}`}>{username}</Link>
        </b>
      </span>
      <span>{new Date(publishedDate).toISOString().replace(/T/, ' ').replace(/\..+/, '') }</span>
    </SubInfoBlock>
  );
};

export default SubInfo;
//<span>{new Date(publishedDate).toLocaleDateString()}</span>