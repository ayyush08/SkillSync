import {z} from 'zod';


export const authMiddlewareSchema = z.object({
    _id: z.string(),
    username: z.string(),
    email: z.string(),
    profilePic: z.string().optional(),
    bio: z.string().optional(),
    field: z.string(),
    profession: z.string(),
    level: z.string(),
    rating: z.number().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
})