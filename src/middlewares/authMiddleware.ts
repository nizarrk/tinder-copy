import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import response from '../tools/response';

declare global {
    namespace Express {
      interface Request {
        user?: any;
      }
    }
  }
  
  const secretKey: string | undefined = process.env.JWT_SECRET;

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');

    if (!token) {
        return response(req, res, { status: 401, message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey || '');
        req.user = decoded;
        next();
    } catch (error) {
        response(req, res, { status: 400, message: 'Invalid token.' });
    }
};
