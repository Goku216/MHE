import { Router } from "express";
import { userRegister } from "../../controllers/userControllers/userControllers.js";

export const userRouter=Router()

userRouter.post('/user',userRegister)
