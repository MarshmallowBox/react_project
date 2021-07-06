import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { readPost, unloadPost } from '../../modules/post';
import PostViewer from '../../components/post/PostViewer';
import PostActionButtons from '../../components/post/PostActionButtons';
import { setOriginalPost } from '../../modules/write';
// history는 
const PostViewerContainer = ({ match, history }) => {
  console.log('PostViewerContainer');
  // 처음 마운트 될 때 포스트 읽기 API 요청
  const { postId } = match.params;
  const dispatch = useDispatch();
  const { post, error, loading, user } = useSelector (({ post, loading, user }) => ({
    post: post.post,
    error: post.error,
    loading: loading['post/READ_POST'],
    user: user.user
  }));
  
  const onEdit = () => {
    dispatch(setOriginalPost(post[0]));
    history.push('/write');
  };
  
  const ownPost = (user && user.owner) === (post && post.user);
  
  useEffect(() => {
    dispatch(readPost(postId));
    // post 페이지를 나갈 때 initialState를 넣어준다
    return () => {
      dispatch(unloadPost());
    }
  }, [dispatch, postId]);
  
  return <PostViewer post={post} loading={loading} error={error} actionButtons={ownPost && <PostActionButtons onEdit={onEdit}/>}/>;
}

export default withRouter(PostViewerContainer);