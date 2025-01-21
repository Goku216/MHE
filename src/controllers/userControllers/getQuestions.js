import { configDotenv } from "dotenv";
import { Question } from "../../db/models.js";

configDotenv();

export async function getPHQ9(req, res) {
  try {
    const questions = await Question.findAll({
      where: { questionnaire_id: "phq9" },
      attributes: [
        ["order_index", "id"], // Retrieve order_index as id
        "text",
        "options",
      ],
      order: [["order_index", "ASC"]],
    });
    res.json({ success: true, data: questions });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching PHQ-9 questions",
      error: error.message,
    });
  }
}

export async function getGAD7(req, res) {
  try {
    const questions = await Question.findAll({
      where: { questionnaire_id: "phq9" },
      order: [["order_index", "ASC"]],
    });
    res.json({ success: true, data: questions });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching PHQ-9 questions",
      error,
    });
  }
}
