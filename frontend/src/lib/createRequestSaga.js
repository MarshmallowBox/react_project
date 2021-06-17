import { call, put } from 'redux-saga/effects';
import { startLoading, finishLoading } from '../modules/loading';

export const createRequestActionTypes = type => {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;
  return [type, SUCCESS, FAILURE];
};

export default function createRequestSaga(type, request) {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;
  
  return function*(action) {
    yield put(startLoading(type));
    console.log('lib/createRequestSaga');
    console.log(request);
    console.log(action);
    try {
      const response = yield call(request, action.payload);
      console.log('lib/createRequestSaga Success');
      console.log(response);
      yield put({
        type: SUCCESS,
        payload: response.data,
      });
    } catch (e) {
      console.log('lib/createRequestSaga Failure');
      console.log(e);
      yield put({
        type: FAILURE,
        payload: e,
        error: true,
      });
    }
    // 로딩 완료
    yield put(finishLoading(type));
  };
}