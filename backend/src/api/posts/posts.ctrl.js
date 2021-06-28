import * as db from '../../db.js';
import sanitizeHtml from 'sanitize-html';

// todo
// write 부분 태그 리스트로 보이기
const sanitizeOption = {
  allowedTags: [
    'h1',
    'h2', 
    'b',
    'i',
    'u',
    's',
    'p',
    'ul',
    'ol',
    'li',
    'blockquote',
    'a',
    'img',
  ],
  allowedAttributes: {
    a:['href', 'name', 'target'],
    img:['src'],
    li:['class'],
  },
  alowedSchemes: ['data', 'http'],
}

export const write = async ctx => {
  var { title, body, tags } = ctx.request.body;
  console.log(ctx.request.body);
  if ( !title ) {
    ctx.status = 400;
    return;
  }
  const { username } = ctx.state.user;
  body=sanitizeHtml(body, sanitizeOption);
  try {
    // 제목, 내용, 글쓴이 저장
    
    ctx.body = await db.query(`insert into posts values(default, '${title}','${body}', '${username}', to_timestamp(${Date.now()} / 1000.0)) RETURNING postnum`).then(c => c.rows[0].postnum);

    // 태그 저장
    for ( var i = 0 ; i < tags.length ; i++ ) {
      await db.query(`insert into taglist(postnum, tagnum) values('${ctx.body}',${tags[i]})`);
    }
    
    ctx.status = 200;
    
  } catch(e) {
    ctx.throw(500, e);
    return;
  }
  // console.log(title, body);
  // ctx.body = title;
};

//GET /api/posts?username=&page=
export const list = async ctx => {
  const removeHtmlAndShorten = body => {
    const filtered = sanitizeHtml(body,{
      allowedTags: [],
    });
    return filtered.length < 200 ? filtered : `${filtered.slice(0, 50)}...`;
  }
  
  const page = parseInt(ctx.query.page || '1', 10);
  if (page < 1) {
    ctx.status = 400;
    return;
  }
  try {
    ctx.set('Last-Page', Math.ceil(await db.query(`select count(*) from posts`).then(c => c.rows[0].count) / 10));
    // join 방법 http://www.gurubee.net/lecture/2953
    // 1번방법 - db에서 post와 tag를 따로 가져와서 서버에서 정리해준다.
    // 2번방법 - db에서 join을 이용해 한번에 가져온 후 postnum이 같은 종류끼리 묶어주고 나머지 지워준다.
    
    // LeftJoin으로 한번에 가져올 시
    // var result = await db.query(`select * from posts left join taglist on posts.postnum = taglist.postnum order by posts.postnum desc OFFSET ${(page-1)*10} limit 10`).then(c => c.rows);
    
    // Like 쿼리문 사용시 
    // var result = await db.query(`select * from posts where posts.owner like 'asd' order by posts.postnum desc OFFSET ${(page-1)*10} limit 10 `).then(c => c.rows);
    
    var result = await db.query(`select * from posts order by posts.postnum desc OFFSET ${(page-1)*10} limit 10 `).then(c => c.rows);
    var tags = await db.query(`select * from taglist left join tag on taglist.tagnum = tag.tagnum where postnum>=${result[result.length-1].postnum} and postnum<=${result[0].postnum} order by taglist.postnum desc, taglist.tagnum asc`).then(c => c.rows);
    // var tags = await db.query(`select taglist.postnum tag.tagname from taglist left join tagname on taglist.tagnum = tag.tagnum where postnum>=${result[result.length-1].postnum} and postnum<=${result[0].postnum} order by postnum desc, tagnum asc`).then(c => c.rows);
    // console.log(result);
    // console.log(tags);
    // 이후 result의 postnum에 맞는 tags를 넣어준다.
    console.log("posts.ctrl.js/list");
    var arr = [];
    var j=0, k=0;
    for (var i = 0 ; i < result.length + tags.length ; i++ ) {
      if (result.length <= j || tags.length <= k){ 
        result[j].tags = arr;
        console.log('break');
        break;
      }
      if (result[j].postnum == tags[k].postnum) {
        arr.push(tags[k].tagname);
        k++;
      }
      
      else if (result[j].postnum < tags[k].postnum) {
        result[j].tags = arr;
        arr = [];
        j++;
      }
      
      else if (result[j].postnum > tags[k].postnum) {
        result[j].tags = arr;
        arr = [];
        j++;
      }
    }
    
    // list페이지의 body부분 html태그 없애기
    result = result.map(post => ({
      ...post,
      body: removeHtmlAndShorten(post.body),
    }));
    console.log(result);
    ctx.body = result;
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
  var { title, body } = ctx.request.body;
  body = sanitizeHtml(body, sanitizeOption);
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
    const tags = await db.query(`select * from taglist left join tag on taglist.tagnum = tag.tagnum where taglist.postnum = ${id} order by taglist.postnum desc, taglist.tagnum asc`).then(c => c.rows);
    // console.log(tags);
    // const tags = await db.query(`select tagnum from taglist where postnum = ${post[0].postnum}`).then(c => c.rows);
    var arr = new Array();
    for ( var i = 0 ; i < tags.length ; i++ ) {
      arr.push(tags[i].tagname);
    }
    post[0].tags = arr;
    
    if(!post) {
      ctx.status = 404; // not found
      return;
    }
    console.log(post);
    ctx.state.post = post;
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