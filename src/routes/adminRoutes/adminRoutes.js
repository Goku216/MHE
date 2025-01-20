import { Router } from "express";
import { getAllQuestionnaires } from "../../controllers/adminControllers/questionnaireController.js";

export const adminRouter = Router();

adminRouter.get("/admin/questionnaires", getAllQuestionnaires);
