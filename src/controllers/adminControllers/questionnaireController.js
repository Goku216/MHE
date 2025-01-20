import { configDotenv } from "dotenv";
import { Questionnaire } from "../../db/models.js";
configDotenv();

export const getAllQuestionnaires = async (req, res) => {
  try {
    const questionnaires = await Questionnaire.findAll();
    res.json(questionnaires);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
