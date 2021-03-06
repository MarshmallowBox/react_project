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
    try {
      const response = yield call(request, action.payload);
      console.log('lib/createRequestSaga Success');
      yield put({
        type: SUCCESS,
        payload: response.data,
        meta: response,
      });
    } catch (e) {
      console.log('lib/createRequestSaga Failure');
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