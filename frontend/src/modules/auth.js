import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { takeLatest } from 'redux-saga/effects';
import createRequestSaga, { createRequestActionTypes } from '../lib/createRequestSaga';
import * as authAPI from '../lib/api/auth';

const CHANGE_FIELD = 'auth/CHANGE_FIELD';
const INITIALIZE_FORM = 'auth/INITIALIZE_FORM';

const [REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE] = createRequestActionTypes(
  'auth/REGISTER',
);
const [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE] = createRequestActionTypes(
  'auth/LOGIN',
);

// 액션 타입을 반환하는 함수
export const changeField = createAction(
  CHANGE_FIELD,
  ({ form, key, value }) => ({
    form, //register, login
    key, //username, password, passwordConfirm
    value, //실제 바꾸려는 값
  }),
);

// register/login
export const initializeForm = createAction(INITIALIZE_FORM, form => form);
export const login = createAction(LOGIN, ({ username, password }) => ({
  username,
  password,
}));
export const register = createAction(REGISTER, ({ username, password }) => ({
  username,
  password,
}));

// 사가 생성 (Backend API 쓰기)
const registerSaga = createRequestSaga(REGISTER, authAPI.register);
const loginSaga = createRequestSaga(LOGIN, authAPI.login);
export function* authSaga() {
  yield takeLatest(REGISTER, registerSaga);
  yield takeLatest(LOGIN, loginSaga);
}

// 초기값 설정
const initialState = {
  register: {
    username: '',
    password: '',
    passwordConfirm: '',
  },
  login: {
    username: '',
    password: '',
  },
  auth: null,
  authError: null,
};

const auth = handleActions(
  {
    [CHANGE_FIELD]: (state, { payload: form, key, value }) => 
      produce(state, draft => {
        draft[form][key] = value;  // state.register.username을 바꾼다
      }),
    [INITIALIZE_FORM]: (state, { payload: form }) => ({ //payload: { form } = payload.form
      ...state,
      [form]: initialState[form]
    }),
    [LOGIN_SUCCESS]: (state, { payload: auth }) => ({
      ...state,
      authError: null,
      auth,
    }),
    [LOGIN_FAILURE]: (state, { payload: error }) => ({
      ...state,
      authError: error,
    }),
    [REGISTER_SUCCESS]: (state, { payload: auth }) => ({
      ...state,
      authError: null,
      auth,
    }),
    [REGISTER_FAILURE]: (state, { payload: error }) => ({
      ...state,
      authError: error,
    })
  },
    
  initialState,
);

export default auth;





// import { createAction, handleActions } from 'redux-actions';

// const SAMPLE_ACTION = 'auth/SAMPLE_ACTION';

// export const sampleAction = createAction(SAMPLE_ACTION);

// const initialState = {};

// const auth = handleActions(
//   {
//     [SAMPLE_ACTION]: ( state, action ) => state,
//   },
//   initialState,
// )

// export default auth;
