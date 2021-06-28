import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { readPost, unloadPost } from '../../modules/post';
import PostViewer from '../../components/post/PostViewer';

const PostViewerContainer = ({ match }) => {
  console.log('PostViewerContainer');
  // 처음 마운트 될 때 포ㅅ트 읽기 API 요청
  const { postId } = match.params;
  const dispatch = useDispatch();
  const { post, error, loading } = useSelector (({ post, loading }) => ({
    post: post.post,
    error: post.error,
    loading: loading['post/READ_POST'],
  }));
  
  useEffect(() => {
    dispatch(readPost(postId));
    // post 페이지를 나갈 때 initialState를 넣어준다
    return () => {
      dispatch(unloadPost());
    }
  }, [dispatch, postId]);
  
  return <PostViewer post={post} loading={loading} error={error} />;
}

export default withRouter(PostViewerContainer);