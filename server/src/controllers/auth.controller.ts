import prisma from "../db";
import bcryptjs from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { registerSchema, loginSchema } from "../zod/authSchemas";



interface TokenPayload {
    _id: string;
    email?: string;
    username?: string;
}

interface GenerateTokensResult {
    accessToken: string;
    refreshToken: string;
}

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



const generateAccessAndRefreshToken = async (userId: string): Promise<GenerateTokensResult> => {
    try {

        const existingUser = await prisma.user.findUnique({
            where: {
                id: userId.toString()
            }
        });


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

        if (!username || !email || !password || !fullName || !field || !profession || !skills || !level) {
            throw new ApiError(400, "Please fill in all fields");
        }
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

        if (!parsed.success) {
            console.log(parsed.error)
            throw new ApiError(400, "Error validating register register schema")
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


            if (!newUser) {
                throw new ApiError(500, "Error creating user")
            }

            for (const skill of skills) {
                const createdSkill = await prisma.skill.create({
                    data: {
                        userId: newUser.id,
                        name: skill
                    }
                })
                if (!createdSkill) {
                    throw new ApiError(500, "Error creating skill")
                }
            }




            return { newUser };
        });


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



        res
            .status(201)
            .json(
                new ApiResponse(201, { user: registeredUser }, "User registered successfully")
            )

    } catch (error) {
        console.error(error);
        throw new ApiError(500, error?.message || "Error registering user");

    }
});



const login = asyncHandler(async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!(username || email) || !password) {
            throw new ApiError(400, "Please fill in all fields");
        }

        const parsed = loginSchema.safeParse({ username, email, password });

        if (!parsed.success) {
            console.error(parsed.error.errors)
            throw new ApiError(400, "Error validating login schema");
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        })

        if (!existingUser) {
            throw new ApiError(400, "User does not exist")
        }


        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existingUser.id);

        

        res.cookie("accessToken", accessToken, accessTokenCookieOptions).cookie("refreshToken", refreshToken, refreshTokenCookieOptions)


        const user = await prisma.user.findUnique({
            where: {
                id: existingUser.id
            },
            omit:{
                password:true,
                refreshToken:true
            }
        })

        res
            .status(201)
            .json(
                new ApiResponse(201, { user }, "Logged In Successfully")
            )

    } catch (error) {
        console.error(error);
        throw new ApiError(500, error?.message || "Error loggin in user");
    }

});




const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized Request");
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET as string
        )

        const user = await prisma.user.findFirst({
            where: {
                id: (decodedToken as JwtPayload)._id
            }
        })

        if (!user) {
            throw new ApiError(401, 'Invalid Refresh Token');
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, 'Session expired, Please log in again');
        }


        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user.id);

        res.cookie("accessToken", accessToken, accessTokenCookieOptions).cookie("refreshToken", refreshToken, refreshTokenCookieOptions)

        res
        .status(200)
        .json(new ApiResponse(
            200,
            {accessToken,refreshToken},
            "Access token refreshed successfully"
        ))

    } catch (error) {
        console.error("Error refreshing access token", error);
        throw new ApiError(500,  error?.message || "Error refreshing access token");
    }
});




const logout = asyncHandler(async(req,res)=>{
    try {
        const user = req.user;

        if(!user){
            throw new ApiError(401,"Invalid Request");
        }

        const logoutUser = await prisma.user.update({
            where:{
                id: user.id
            },
            data:{
                refreshToken: null
            }
        })

        if(!logoutUser){
            throw new ApiError(401,"Could not reset token")
        }

        res.clearCookie('accessToken').clearCookie('refreshToken')

        res
        .status(200)
        .json(new ApiResponse(200, {}, "User logged out successfully"));

    } catch (error) {
        
    }
})

export { register, login, logout, refreshAccessToken };