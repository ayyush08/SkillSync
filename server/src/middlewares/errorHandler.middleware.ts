import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

// Explicitly define it as an error-handling middleware
const errorHandler: (err: any, req: Request, res: Response, next: NextFunction) => void =
    (err, req, res, next) => {
        let statusCode = err.statusCode || 500;
        let message = err.message || "Internal Server Error";
        let errors = err.errors || [];

        // Handle unexpected errors
        if (!(err instanceof ApiError)) {
            statusCode = 500;
            message = "Internal Server Error";
            errors = ["An unexpected error occurred"];
        }

        res.status(statusCode).json({
            success: false,
            statusCode,
            message,
            errors,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        });
    };

export { errorHandler };
