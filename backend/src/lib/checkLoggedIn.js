const checkLoggedIn = (ctx, next) => {
  console.log('checkLoggedIn');
  if (!ctx.state.user) {
    // unauthorize
    ctx.status = 401;
    return;
  }
  return next();
}

export default checkLoggedIn;