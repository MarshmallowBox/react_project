import jwt from 'jsonwebtoken';
import * as tokentool from '../api/auth/tokentool.js';
const jwtMiddleware = (ctx, next) => {
  console.log('jwtMiddleware');
  const token = ctx.cookies.get('access_token');
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ctx.state.user = {
      usernum: decoded.usernum,
      username: decoded.username,
    };
    
    // 토큰 재발급
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp - now < 60*60*24*3.5) {
      const token = tokentool.generateToken(decoded.usernum, decoded.username);
        ctx.cookies.set('access_token', token, {
          maxAge: 1000*60*60*24*7,
          httpOnly: true,
        })
    }
    console.log(decoded);
    return next();
  } catch (e) {
    // 토큰 검증 실패
    return next();
  }
}

export default jwtMiddleware;