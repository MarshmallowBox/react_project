import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

export const generateToken = (usernum, username) => {
  const token = jwt.sign(
    {
      usernum: usernum,
      username: username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    },
  );
  return token;
}