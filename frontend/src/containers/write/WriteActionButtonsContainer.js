import React, { useEffect } from 'react';
import WriteActionButtons from '../../components/write/WriteActionButtons';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { writePost } from '../../modules/write';


const WriteActionButtonsContainer = ({ history }) => {
  const dispatch = useDispatch();
  const { title, body, tags, postnum, postError } = useSelector(({ write }) => ({
    title: write.title,
    body: write.body,
    tags: write.tags,
    postnum: write.postnum,
    postError: write.postError,
  }));



// 포스트 등록
  const onPublish = () => {
    console.log('포스트 등록 버튼 클릭');
    dispatch(
      writePost({
        title,
        body,
        tags,
      }),
    );
    
  };



// 취소
  const onCancel = () => {
    console.log('포스트 취소 버튼 클릭');
    history.goBack();
  };



// 성공 혹은 실패 시 할 작업
  useEffect(() => {
    console.log('WriteActionButtonContainer useEffect 내부');
    console.log(postnum);
    console.log(title);
    console.log(body);
    console.log(tags);
    if (postnum) {
      console.log('containers/write/WriteActionButtonContainer Success');
      // const { _id, user } = post;
      history.push(`/post/${postnum}`);
    }
    if (postError) {
      console.log('containers/write/WriteActionButtonContainer Error');
      console.log(postError);
    }
    console.log('WriteActionButtonContainer useEffect 끝');
  }, [history, title,body,tags, postnum, postError]);
  
  return <WriteActionButtons onPublish={onPublish} onCancel={onCancel} />;
};



export default withRouter(WriteActionButtonsContainer);