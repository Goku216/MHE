import { Router } from "express";
import { userLogin, userRegister } from "../../controllers/userControllers/userControllers.js";

export const userRouter=Router()

userRouter.post('/user/register',userRegister)
userRouter.post('/user/login',userLogin)
