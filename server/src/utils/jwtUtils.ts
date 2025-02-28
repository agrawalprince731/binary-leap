import jwt from 'jsonwebtoken';
import dotenv from "dotenv"

dotenv.config();


interface TokenPayload {
  id: string;
}

export const generateauthToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
};


export const verifyauthToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as TokenPayload;
};

