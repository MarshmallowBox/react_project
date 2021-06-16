import * as db from '../../db.js';
export const write = async ctx => {
  const { title, body } = ctx.request.body;
  if ( !title ) {
    ctx.status = 400;
    return;
  }
  const { username } = ctx.state.user;
  try {
    ctx.body = await db.query(`insert into posts values(default, '${title}','${body}', '${username}') RETURNING postnum`).then(c => c.rows[0].postnum);
    ctx.status = 200;
    console.log(ctx.body);
  } catch(e) {
    ctx.throw(500, e);
    return;
  }
  // console.log(title, body);
  // ctx.body = title;
};

//GET /api/posts?username=&page=
export const list = async ctx => {
  const page = parseInt(ctx.query.page || '1', 10);
  if (page < 1) {
    ctx.status = 400;
    return;
  }
  try {
    ctx.set('Last-Page', Math.ceil(await db.query(`select count(*) from posts`).then(c => c.rows[0].count) / 10));
    ctx.body = await db.query(`select * from posts order by postnum desc OFFSET ${(page-1)*10} limit 10`).then(c => c.rows);
    console.log(ctx.body);
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const read = async ctx => {
  ctx.body = ctx.state.post;
};

export const remove = async ctx => {
  const { id } = ctx.params;
  try {
    await db.query(`delete from posts where postnum = ${id}`);
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e); 
  }
};

export const update = async ctx => {
  const { title, body } = ctx.request.body;
  const { id } = ctx.params;
  try {
    await db.query(`update posts set title = '${title}', body = '${body}' where postnum = ${id}`);
    ctx.status = 204;
  } catch(e) {
    ctx.throw(500, e);
  }
  console.log(title, body);
  ctx.body = title;
};

export const getPostById = async (ctx, next) => {
  console.log('getPostById');
  const { id } = ctx.params;
  try {
    const post = await db.query(`select * from posts where postnum = ${id}`).then(c => c.rows);
    if(!post) {
      ctx.status = 404; // not found
      return;
    }
    ctx.state.post = post;
    console.log(post);
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
}

export const checkOwnPost = (ctx, next) => {
  console.log('checkOwnPost');
  const { user, post } = ctx.state;
  if(post[0].owner !== user.username){
    ctx.status = 403;
    return;
  }
  return next();
}