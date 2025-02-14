import { Router } from "express";
import {
  getAllQuestionnaires,
  setNewQuestionnaire,
  updateQuestionnaire,
  deleteQuestionnaire,
} from "../../controllers/adminControllers/questionnaireController.js";
import { getAllUsers } from "../../controllers/adminControllers/getUsersController.js";
import { getAdmin } from "../../controllers/adminControllers/getAdminStats.js";

export const adminRouter = Router();

adminRouter.get("/admin/questionnaires", getAllQuestionnaires);
adminRouter.post("/admin/questionnaires", setNewQuestionnaire);
adminRouter.put("/admin/questionnaires/:id", updateQuestionnaire);
adminRouter.delete("/admin/questionnaires/:id", deleteQuestionnaire);
adminRouter.get("/admin/getusers", getAllUsers);
adminRouter.get("/admin/getadmin", getAdmin);
