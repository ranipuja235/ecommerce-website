import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User.model';
export interface AuthRequest extends Request {
    user?: IUser;
}
export declare const verifyToken: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map