import React from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import Responsive from '../common/Responsive';
import SubInfo from '../common/SubInfo';
import Tags from '../common/Tags';
const PostViewBlock = styled(Responsive)`
  margin top: 4rem;
`;

const PostHead = styled.div`
  border-bottom: 1px solid ${palette.gray[2]};
  padding-bottom: 3rem;
  margin-bottom: 3rem;
  h1 {
    font-size: 3rem;
    line-height: 1.5;
    margin: 0;
  }
`;

const PostContents = styled.div`
  font-size: 1.3125rem;
  color: ${palette.gray[8]};
`;

const PostViewer = ({ post, error, loading, actionButtons }) => {
  // 에러 발생시
  if (error) {
    if (error.response && error.response.status === 404 ) {
      return <PostViewBlock>존재하지 않는 포스트 입니다</PostViewBlock>
    }
    return <PostViewBlock>오류 발생!</PostViewBlock>;
  }
  
  // 로딩 중이거나 아직 포스트 데이터가 없을때
  if (loading || !post) {
    return null;
  }
  const { title, body, owner, publisheddate, tags } = post[0];
  console.log('PostViewer.js');
  console.log(post[0]);
  return (
    <PostViewBlock>
      <PostHead>
        <h1>{title}</h1>
        <SubInfo
          username={owner}
          publishedDate={publisheddate}
          hasMarginTop
        />
        <Tags
          tags={tags}
        />
      </PostHead>
      {actionButtons}
      <PostContents
        dangerouslySetInnerHTML={{__html: body }}
      />
    </PostViewBlock>  
  )
}

export default PostViewer;