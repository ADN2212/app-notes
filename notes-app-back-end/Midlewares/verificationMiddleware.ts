import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const accessTokenSecret: string = String(process.env.ACCESS_TOKEN_SECRET || '');

function verificationMiddleware (req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.authorization;
    const token = auth && auth.split(' ')[1];

    if (!token) {
        res.status(401).json({ 
            error: 'Se requiere un token para completar esta acción' 
        })
        return 
    }

    jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) {
            res.status(403).json({ 
                error: 'Token invalido.',
                sessionExpired: true
            });
            return
        }
        req.body.user = user;
        next();
      });
}


export default verificationMiddleware;
