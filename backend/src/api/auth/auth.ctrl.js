import Joi from '@hapi/joi';
import bcrypt from 'bcrypt';
import * as db from '../../db.js';
import * as tokentool from './tokentool.js';

export const register = async ctx => {
  console.log("api/auth/register");
  // Joi 스키마 생성 및 검증
  const schema = Joi.object().keys({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(20)
      .required(),
    password: Joi.string().required(),
  });
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }
  
  // ID 중복 확인 및 ID 생성
  const { username, password }= ctx.request.body;
  try {
    const exist = await db.query(`select count(*) from users where username = '${username}'`).then(c => c.rows[0].count);
    if (exist === '0'){
      try {
        const hashedpassword = await bcrypt.hash(password, 10);
        const usernum = await db.query(`insert into users values(default, '${username}','${hashedpassword}') RETURNING usernum`).then(c => c.rows[0].usernum);
        const token = tokentool.generateToken(usernum, username);
        ctx.cookies.set('access_token', token, {
          maxAge: 1000*60*60*24*7,
          httpOnly: true,
        });
        ctx.body = username;
      } catch(e) {
        ctx.throw(500, e);
        return;
      }
    } else {
      // conflict
      ctx.status = 409;
      return;
    }
  } catch(e) {
    ctx.throw(500, e);
  }
};

export const login = async ctx => {
  const { username, password }= ctx.request.body;
  
  // username과 password가 없으면 에러처리
  if (!username || !password) {
    // Unauthorized
    ctx.status = 401;
    return;
  }
  
  try {
    const user = await db.query(`select * from users where username = '${username}'`).then(c => c.rows);
    console.log(user);
    const valid = await bcrypt.compare(password, user[0].hashedpassword);
    if (!valid) {
      ctx.status = 401;
      return;
    }
    const token = tokentool.generateToken(user[0].usernum, username);
    ctx.cookies.set('access_token', token, {
      maxAge: 1000*60*60*24*7,
      httpOnly: true,
    });
    delete user[0].hashedpassword;
    ctx.body = user;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const check = async ctx => {
  console.log('checkLoggedIn');
  const { user }  = ctx.state;
  console.log(user);
  if(!user) {
    // 로그인 중이 아닐때
    ctx.status = 401;
    return;
  }
  ctx.body = user;
};

export const logout = async ctx => {
  ctx.cookies.set('access_token');
  ctx.status = 204;
};