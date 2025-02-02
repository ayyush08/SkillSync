import prisma from "../db";
import bcryptjs from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { registerSchema } from "../zod/authSchemas";



interface TokenPayload {
    _id: string;
    email?: string;
    username?: string;
}

interface GenerateTokensResult {
    accessToken: string;
    refreshToken: string;
}

const generateAccessAndRefreshToken = async (userId: string): Promise<GenerateTokensResult> => {
    try {

        const existingUser = await prisma.user.findUnique({
            where:{
                id: userId.toString()
            }
        });
        console.log("existingUser", existingUser,userId);
        

        if (!existingUser) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = jwt.sign(
            { _id: existingUser.id, email: existingUser.email, username: existingUser.username } as TokenPayload,
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY as string } as jwt.SignOptions
        );

        const refreshToken = jwt.sign(
            { _id: userId } as TokenPayload,
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY as string } as jwt.SignOptions
        );

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                refreshToken: refreshToken
            }
        })

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error generating tokens", error);
        throw new ApiError(500, "Error generating tokens");
    }
}



const register = asyncHandler(async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            fullName,
            profilePic,
            bio,
            field,
            profession,
            skills,
            level,
        } = req.body;

        const parsed = registerSchema.safeParse({
            username,
            email,
            password,
            fullName,
            profilePic,
            bio,
            field,
            profession,
            skills,
            level,
        })

        if(!parsed.success){
            console.log(parsed.error)
            throw new ApiError(400, parsed.error.errors[0].message || "Zod validation error on register schema")
        }

        if (!username || !email || !password || !fullName || !field || !profession || !skills || !level) {
            throw new ApiError(400, "Please fill in all fields");
        }

        const transaction = await prisma.$transaction(async (prisma) => {

            
            const existingUserByEmail = await prisma.user.findUnique({ where: { email } });
            
            if (existingUserByEmail) {
                throw new ApiError(400, "User with this email already exists");
            }

            const existingUserByUsername = await prisma.user.findUnique({ where: { username } });
            
            if (existingUserByUsername) {
            throw new ApiError(400, "User with this username already exists");
        }

        const hashedPassword = await bcryptjs.hash(password, 12);
        
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                fullName,
                profilePic,
                bio,
                field,
                profession,
                level,
            },
        });


        if(!newUser){
            throw new ApiError(500, "Error creating user")
        }
        
        for(const skill of skills){
            const createdSkill = await prisma.skill.create({
                data:{
                    userId: newUser.id,
                    name:skill
                }
            })
            if(!createdSkill){
                throw new ApiError(500, "Error creating skill")
            }
        }
        
        
        
        
        return { newUser };
    });
    
    const accessTokenCookieOptions = {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'none' as const,
        path: '/'
    }
    
    const refreshTokenCookieOptions = {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'none' as const,
    }
    const { newUser } = transaction;
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(newUser.id);

        res.cookie("accessToken", accessToken, accessTokenCookieOptions).cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
        

        const registeredUser = await prisma.user.findUnique({
            where: {
                id: newUser.id
            },
            select: {
                id: true,
                username: true,
                email: true,
                fullName: true,
                profilePic: true,
                bio: true,
                field: true,
                profession: true,
                skills: true,
                level: true,
                rating: true,
            }
        })

        console.log(registeredUser);
        

        res
            .status(201)
            .json(
                new ApiResponse(201, { user: registeredUser }, "User registered successfully",)
            )

    } catch (error) {
        console.error( error);
        throw new ApiError(500, error?.message || "Error registering user");

    }
});



const login = asyncHandler(async (req, res) => {
    res.send("login");
});




const logout = asyncHandler(async (req, res) => {
    res.send("logout");
});






export { register, login, logout, generateAccessAndRefreshToken };