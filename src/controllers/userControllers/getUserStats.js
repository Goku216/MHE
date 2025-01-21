import { configDotenv } from "dotenv";
import {
  User,
  EvaluationSession,
  Questionnaire,
  Result,
} from "../../db/models.js";

configDotenv();

export async function getStats(req, res) {
  try {
    const userId = req.params.id;

    // Fetch user data
    const user = await User.findOne({ where: { userid: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch user's evaluation sessions with related questionnaire and results
    const sessions = await EvaluationSession.findAll({
      where: { user_id: userId },
      include: [{ model: Questionnaire }, { model: Result }],
      order: [["completed_at", "DESC"]],
    });

    // Format recent tests
    let recentTests = sessions
      .map((session) => {
        if (
          !session.Questionnaire ||
          !session.Result ||
          !session.completed_at
        ) {
          return null;
        }
        return {
          id: session.id,
          type: session.Questionnaire.title || "Not Available",
          score: session.Result.score || "Not Available",
          date: session.completed_at
            ? session.completed_at.toISOString().split("T")[0]
            : "Not Available",
          severity: session.Result.severity || "Not Available",
        };
      })
      .filter((test) => test !== null)
      .slice(0, 3);

    // Ensure it's always an array
    if (recentTests.length === 0) {
      recentTests = [
        {
          id: "Not Available",
          type: "Not Available",
          score: "Not Available",
          date: "Not Available",
          severity: "Not Available",
        },
      ];
    }

    const latestTest = recentTests[0] || {
      score: "Not Available",
      severity: "Not Available",
    };

    // Fetch available tests
    const availableTests = await Questionnaire.findAll();
    const formattedTests = availableTests.map((test) => ({
      id: test.id,
      name: test.title,
      description: test.description || "Not Available",
      timeToComplete: test.time_to_complete || "Not Available",
      questions: test.no_of_questions || "Not Available",
    }));

    const responseData = {
      name: user.username,
      id: user.userid,
      lastAssessment: sessions.length
        ? sessions[0].completed_at.toISOString().split("T")[0]
        : "Not Available",
      stats: {
        testsCompleted: sessions.length,
        streak: 5, // Placeholder, logic can be added
        latestScore: latestTest.score,
        severity: latestTest.severity,
      },
      availableTests: formattedTests,
      recentTests,
    };

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
