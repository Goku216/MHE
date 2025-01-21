import { Router } from "express";
import { getAllQuestionnaires } from "../../controllers/adminControllers/questionnaireController.js";
import { getAllUsers } from "../../controllers/adminControllers/getUsersController.js";

export const adminRouter = Router();

adminRouter.get("/admin/questionnaires", getAllQuestionnaires);
adminRouter.get("/admin/getusers", getAllUsers);
