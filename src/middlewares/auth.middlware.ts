import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PublicUser } from '../models/user.model';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.header('authorization');

    const token = authorization && authorization.split(' ')[1];

    if (!token) {
        res.status(401).send('Unauthorized');
        return;
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(500).send('Server Error');
        return;
    }

    try {
        const payload = jwt.verify(token, process.env.TOKEN_SECRET) as PublicUser;
        req.userId = payload._id;
        next();
    } catch (err) {
        res.status(401).send('Unauthorized');
    }
};
