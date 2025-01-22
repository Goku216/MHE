import { configDotenv } from "dotenv";
import {
  User,
  EvaluationSession,
  Questionnaire,
  Result,
} from "../../db/models.js";
import { Op } from "sequelize";

configDotenv();

export async function getStats(req, res) {
  try {
    const userId = req.params.id;

    const user = await User.findOne({ where: { userid: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch user's evaluation sessions with related data
    const sessions = await EvaluationSession.findAll({
      where: {
        user_id: userId,
        completed_at: { [Op.ne]: null }, // Only include completed sessions
      },
      include: [{ model: Questionnaire }, { model: Result }],
      order: [["completed_at", "DESC"]],
    });

    // Calculate streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sessions.length; i++) {
      const sessionDate = new Date(sessions[i].completed_at);
      sessionDate.setHours(0, 0, 0, 0);

      if (i === 0) {
        // Check if the latest session is from today or yesterday
        const daysDiff = Math.floor(
          (today - sessionDate) / (1000 * 60 * 60 * 24)
        );
        if (daysDiff > 1) break;
        streak++;
        continue;
      }

      const prevSessionDate = new Date(sessions[i - 1].completed_at);
      prevSessionDate.setHours(0, 0, 0, 0);

      // Check if sessions are on consecutive days
      const daysBetween = Math.floor(
        (prevSessionDate - sessionDate) / (1000 * 60 * 60 * 24)
      );
      if (daysBetween === 1) {
        streak++;
      } else {
        break;
      }
    }

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
        streak,
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

export async function getUsername(req, res) {
  try {
    const userId = req.params.id;

    const user = await User.findOne({ where: { userid: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ username: user.username, email: user.email });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
