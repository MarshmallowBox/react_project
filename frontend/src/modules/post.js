// 데이터를 읽어서 보여주는 리덕스 모듈
import { createAction, handleActions } from 'redux-actions';
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';
import * as postsAPI from '../lib/api/posts';
import { takeLatest } from 'redux-saga/effects';

// 초기 값 설정
const initialState = {
  post: null,
  error: null,
};

// 액션함수 타입 생성
const [
  READ_POST,
  READ_POST_SUCCESS,
  READ_POSTS_FAILURE,
] = createRequestActionTypes('post/READ_POST');
const UNLOAD_POST = 'post/UNLOAD_POST';

// 액션함수 생성
export const readPost = createAction(READ_POST, postnum => postnum );
export const unloadPost = createAction(UNLOAD_POST);

const readPostSaga = createRequestSaga(READ_POST, postsAPI.readPost);
export function* postSaga() {
  yield takeLatest(READ_POST, readPostSaga);
}

const post = handleActions(
  {
    [READ_POST_SUCCESS]: ( state, { payload: post }) => ({
      ...state,
      post,
    }),
    [READ_POSTS_FAILURE]: ( state, { payload: error }) => ({
      ...state,
      error,
    }),
    [UNLOAD_POST]: () => initialState,
  } ,
  initialState,
)

export default post;
