import React from 'react';
import styled from 'styled-components';
import Responsive from '../common/Responsive';
import Button from '../common/Button';
import palette from '../../lib/styles/palette';
import SubInfo from '../common/SubInfo';
import Tags from '../common/Tags';
import { Link } from 'react-router-dom';
const PostListBlock = styled(Responsive)`
  margin-top: 3rem;
`;

const WritePostButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 3rem;
`;

const PostItemBlock = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;
  
  /* 맨 위 포스트는 padding-top 없음 */
  &:first-child {
    padding-top:0;
  }
  & + & {
    border-top: 1px solid ${palette.gray[2]};
  }
  
  h2 {
    font-size: 2rem;
    margin-bottom: 0;
    margin-top: 0;
    &:hover {
      color: ${palette.gray[6]};
    }
  
  p {
    margin-top: 2rem;
  }
`;

// const SubInfo = styled.div`
//   /* margin-top: 1rem;*/
//   color: ${palette.gray[6]};

//   /* span 사이에 가운뎃점 문자 보여주기 */
//   span + span:before {
//     color: ${palette.gray[5]};
//     padding-left: 0.25rem;
//     padding-right: 0.25rem;
//     content: '\\B7'; /* 가운뎃점 문자 */
//   }
// `;

// const Tags = styled.div`
//   margin-top: 0.5rem;
//   .tag {
//     display: inline-block;
//     color: ${palette.cyan[7]};
//     text-decoration: none;
//     margin-right: 0.5rem;
//     &:hover {
//       color: ${palette.cyan[6]};
//     }
//   }
// `;

const PostItem = ({ post }) => {
  console.log(post);
  const { publisheddate, owner, tags, title, body, postnum } = post;
  return (
    <PostItemBlock>
      <h2>
        <Link to = {`/post/${postnum}`}>
          {title}
        </Link>
      </h2>
      <SubInfo 
        username={owner} 
        publishedDate={new Date(publisheddate)} 
      />
      <Tags tags={tags} />
      <p>{body}</p>
    </PostItemBlock>
  );
};

const PostList = ({ posts, loading, error, showWriteButton }) => {
  if (error) {
    return <PostListBlock> 에러가 발생하였습니다. </PostListBlock>
  }
  return(
    <PostListBlock>
      <WritePostButtonWrapper>
        {showWriteButton &&  (
          <Button to='/write'>
            새 글 작성하기
          </Button>
        )}
      </WritePostButtonWrapper>
      
      {/* 로딩중이 아니고, 포스트 배열이 존재할 때만 보여 줌*/}
      {!loading && posts && (
        <div>
          {posts.map(post => (
            <PostItem post={post} key={post.postnum} />
          ))}
        </div>
      )}
    </PostListBlock>
  )
}

export default PostList;
