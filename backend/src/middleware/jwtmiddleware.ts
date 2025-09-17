import { type Request ,type  Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

interface JwtPayload{
    id : string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try{
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({error: "No token provided"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        (req as any).userId = decoded.id;
        next();
    
    }catch(error){
        res.status(401).json({error: "Invalid token"});

    }
};
