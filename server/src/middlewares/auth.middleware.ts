import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { z } from "zod";
import prisma from "../db";
import jwt, {
    JwtPayload

} from 'jsonwebtoken'




export const verifyJWT = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            
            const token =
                req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");



            if (!token) {
                throw new ApiError(401, "Unauthorized request,Token not found");
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


            req.user = user;
            
            next();
        } catch (error: any) {
            console.error(error)
            throw new ApiError(401, error?.message || "Invalid Access Token");
        }
    }
);