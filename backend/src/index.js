
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import api from './api/index.js';
import jwtMiddleware from './lib/jwtMiddleware.js';

const app = new Koa();
const router = new Router();


// 라우터 설정
router.use('/api', api.routes());

// 라우터 적용 전 bodyParser 적용
app.use(bodyParser());
app.use(jwtMiddleware);

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());


app.listen(3000, () => {
  console.log('Listening to port 3000');
});