import prisma from "../db";
import bcryptjs from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";



const generateAccessAndRefreshToken = (userId) => {
    console.log("generateAccessAndRefreshToken");

}



const register = asyncHandler(async (req, res) => {
    res.send("Register");
});



const login = asyncHandler(async (req, res) => {
    res.send("login");
});




const logout = asyncHandler(async (req, res) => {
    res.send("logout");
});




export { register, login, logout };