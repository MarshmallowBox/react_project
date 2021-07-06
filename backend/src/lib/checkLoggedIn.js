const checkLoggedIn = (ctx, next) => {
  console.log('checkLoggedIn');
  if (!ctx.state.user) {
    // unauthorize
    ctx.status = 401;
    // ctx.redirect('/login');
    return;
  }
  return next();
}

export default checkLoggedIn;