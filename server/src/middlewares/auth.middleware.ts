import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { authMiddlewareSchema } from "../zod/authSchemas";
import { z } from "zod";
import prisma from "../db";
import jwt, {
    JwtPayload

} from 'jsonwebtoken'



interface AuthRequest extends Request{
    user?: z.infer<typeof authMiddlewareSchema>
}


export const verifyJWT = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const token =
                req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

            if (!token) {
                throw new ApiError(401, "Unauthorized request");
            }
            const decodedToken = jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET as string
            ) as JwtPayload & { _id: string };

            const user = await prisma.user.findUnique({
                where:{
                    id:   decodedToken._id
                }
            })

            if (!user) {
                throw new ApiError(401, "Invalid Access Token");
            }

            // Validate and transform user data using Zod
            const safeUser = authMiddlewareSchema.parse(user);

            req.user = safeUser;
            
            next();
        } catch (error: any) {
            throw new ApiError(401, error?.message || "Invalid Access Token");
        }
    }
);