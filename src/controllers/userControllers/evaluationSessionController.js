import { configDotenv } from "dotenv";
import { EvaluationSession } from "../../db/models.js";

configDotenv();

export async function createSession(req, res) {
  try {
    const { id, user_id, questionnaire_id, started_at, completed_at, status } =
      req.body;

    if (!id || !user_id || !questionnaire_id) {
      return res
        .status(400)
        .json({ error: "id, user_id, and questionnaire_id are required" });
    }

    const newSession = await EvaluationSession.create({
      id,
      user_id,
      questionnaire_id,
      started_at: started_at || new Date(),
      completed_at: completed_at || null,
      status: status || "pending",
    });

    res
      .status(201)
      .json({ message: "Evaluation session created", data: newSession });
  } catch (error) {
    console.error("Error creating evaluation session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function completeSession(req, res) {
  try {
    const { id } = req.params;

    // Find the existing session by id
    const session = await EvaluationSession.findByPk(id);
    if (!session) {
      return res.status(404).json({ error: "Evaluation session not found" });
    }

    // Update status to 'completed' and set completion time
    session.status = "completed";
    session.completed_at = new Date();

    await session.save();

    res
      .status(200)
      .json({ message: "Test completed successfully", data: session });
  } catch (error) {
    console.error("Error updating test session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
