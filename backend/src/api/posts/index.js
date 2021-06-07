import Router from 'koa-router';
import * as postsCtrl from './posts.ctrl.js';
import checkLoggedIn from '../../lib/checkLoggedIn.js';
const posts = new Router();
const post = new Router();

posts.get('/', checkLoggedIn, postsCtrl.list);
posts.post('/', checkLoggedIn, postsCtrl.write);

// api/posts/:id
post.get('/', checkLoggedIn, postsCtrl.read);
post.delete('/', checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.remove);
post.patch('/', checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.update);

posts.use('/:id', postsCtrl.getPostById, post.routes());

export default posts;