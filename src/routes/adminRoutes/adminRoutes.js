import { Router } from "express";
import {
  getAllQuestionnaires,
  setNewQuestionnaire,
  updateQuestionnaire,
  deleteQuestionnaire,
} from "../../controllers/adminControllers/questionnaireController.js";
import { getAllUsers } from "../../controllers/adminControllers/getUsersController.js";
import {
  getAdmin,
  updateAdminStats,
  updateAdminPass,
  deleteUser,
} from "../../controllers/adminControllers/getAdminStats.js";
import { sendEmail } from "../../controllers/adminControllers/sendEmail.js";

export const adminRouter = Router();

adminRouter.get("/admin/questionnaires", getAllQuestionnaires);
adminRouter.post("/admin/questionnaires", setNewQuestionnaire);
adminRouter.put("/admin/questionnaires/:id", updateQuestionnaire);
adminRouter.delete("/admin/questionnaires/:id", deleteQuestionnaire);
adminRouter.get("/admin/getusers", getAllUsers);
adminRouter.get("/admin/getadmin", getAdmin);
adminRouter.put("/admin/updatestats", updateAdminStats);
adminRouter.put("/admin/updatepassword", updateAdminPass);
adminRouter.delete("/admin/deleteuser/:id", deleteUser);
adminRouter.post("/admin/sendemail", sendEmail);
