import { Router } from "express";
import { userRegister } from "../../controllers/userControllers/userRegister.js";

export const userRouter=Router()

userRouter.post('/user',userRegister)
