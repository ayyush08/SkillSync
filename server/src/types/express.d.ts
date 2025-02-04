import { z } from "zod";
import { authMiddlewareSchema } from "../zod/authSchemas"; // Adjust path if needed

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
