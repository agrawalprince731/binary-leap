import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface DecodedToken extends JwtPayload {
    id: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    let token;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else {
        token = req.cookies.authToken;
    }

    if (!token) {
        res.status(401).json({ message: 'No token, authorization denied' });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
