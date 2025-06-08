import { z } from "zod"

export const createUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(20)
}) 


export const signinSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(20)
})

export const roomSchema = z.object({
    name: z.string().min(3).max(20)
})