import { Router } from "express";
import {
  userLogin,
  userRegister,
} from "../../controllers/userControllers/userControllers.js";
import {
  getPHQ9,
  getGAD7,
} from "../../controllers/userControllers/getQuestions.js";

import {
  createSession,
  completeSession,
} from "../../controllers/userControllers/evaluationSessionController.js";

import { getResult } from "../../controllers/userControllers/resultController.js";
import { getStats } from "../../controllers/userControllers/getUserStats.js";

export const userRouter = Router();

userRouter.post("/user/register", userRegister);
userRouter.post("/user/login", userLogin);
userRouter.get("/user/phq9", getPHQ9);
userRouter.get("/user/gad7", getGAD7);
userRouter.post("/user/evaluation-sessions", createSession);
userRouter.post("/user/evaluate", getResult);
userRouter.get("/user/:id/getstats", getStats);
userRouter.patch("/user/:id/complete-session", completeSession);
userRouter.post("/user/:id/submit-answers", getResult);
