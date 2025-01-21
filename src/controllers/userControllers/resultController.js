import { v4 as uuidv4 } from "uuid";
import { Result } from "../../db/models.js";
import { predictPHQ9 } from "../../Prediction/phq9/predictPHQ9.js";
import { predictGAD7 } from "../../Prediction/gad7/predictGAD7.js";

// Function to get PHQ9 recommendation based on severity level
const getPHQ9Recommendation = (severityLevel) => {
  switch (severityLevel.toLowerCase()) {
    case "minimal":
      return "Your symptoms suggest minimal depression. Continue monitoring your mood and maintain healthy habits.";
    case "mild":
      return "Your symptoms suggest mild depression. Consider talking to a mental health professional for support and guidance.";
    case "moderate":
      return "Your symptoms suggest moderate depression. We recommend consulting with a mental health professional for a full evaluation.";
    case "moderately severe":
      return "Your symptoms suggest moderately severe depression. Please seek professional help - you may benefit from counseling and/or medication.";
    case "severe":
      return "Your symptoms suggest severe depression. Please seek immediate professional help. Contact a mental health provider or emergency services if you're having thoughts of self-harm.";
    default:
      return "Please consult with a healthcare provider to discuss your symptoms and get personalized advice.";
  }
};

// Function to get GAD7 recommendation based on anxiety level
const getGAD7Recommendation = (anxietyLevel) => {
  switch (anxietyLevel.toLowerCase()) {
    case "minimal":
      return "Your symptoms suggest minimal anxiety. Continue monitoring your mood and maintain healthy practices.";
    case "mild":
      return "Your symptoms suggest mild anxiety. Consider implementing stress management techniques and talking to a counselor if symptoms persist.";
    case "moderate":
      return "Your symptoms suggest moderate anxiety. We recommend consulting with a mental health professional for proper evaluation and support.";
    case "severe":
      return "Your symptoms suggest severe anxiety. Please seek professional help promptly. A mental health provider can help you develop an appropriate treatment plan.";
    default:
      return "Please consult with a healthcare provider to discuss your symptoms and get personalized advice.";
  }
};

export async function getResult(req, res) {
  try {
    const session_id = req.params.id;
    const { answers, assessmentType } = req.body;

    // Validate input based on assessment type
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        error: "Invalid answers format. Answers must be an array.",
      });
    }

    // Check for correct number of answers based on assessment type
    if (assessmentType === "PHQ9" && answers.length !== 9) {
      return res.status(400).json({
        error: "PHQ-9 requires exactly 9 answers.",
      });
    } else if (assessmentType === "GAD7" && answers.length !== 7) {
      return res.status(400).json({
        error: "GAD-7 requires exactly 7 answers.",
      });
    }

    let result;
    let recommendation;
    let resultData;

    // Use appropriate prediction function based on assessment type
    if (assessmentType === "PHQ9") {
      result = await predictPHQ9(answers);
      recommendation = getPHQ9Recommendation(result.severity_level);

      // Calculate total score for PHQ-9
      const score = answers.reduce((sum, value) => sum + value, 0);

      // Save to database
      resultData = await Result.create({
        id: uuidv4(),
        session_id: session_id,
        score: score,
        severity: result.severity_level,
      });

      res.status(200).json({
        success: true,
        data: {
          id: resultData.id,
          status: result.status,
          severity: result.severity_level,
          score: score,
          recommendation: recommendation,
          completedAt: resultData.createdAt,
        },
      });
    } else if (assessmentType === "GAD7") {
      result = await predictGAD7(answers);
      recommendation = getGAD7Recommendation(result.anxiety_level);

      // Calculate total score for GAD-7
      const score = answers.reduce((sum, value) => sum + value, 0);

      // Save to database
      resultData = await Result.create({
        id: uuidv4(),
        session_id: session_id,
        score: score,
        severity: result.anxiety_level,
      });

      res.status(200).json({
        success: true,
        data: {
          id: resultData.id,
          status: result.status,
          severity: result.anxiety_level,
          score: score,
          recommendation: recommendation,
          completedAt: resultData.createdAt,
        },
      });
    } else {
      return res.status(400).json({
        error: "Invalid assessment type. Expected PHQ9 or GAD7.",
      });
    }
  } catch (error) {
    console.error("Error processing assessment:", error);
    res.status(500).json({
      error: "An error occurred while processing the assessment",
    });
  }
}
