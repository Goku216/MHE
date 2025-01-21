import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

// Get the current file's directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use the correct script path
const scriptPath = path.join(__dirname, "gad7predict.py");

/**
 * Validates input data for GAD-7 questionnaire
 * @param {Array<number>} inputData - Array of 7 GAD-7 scores
 * @throws {Error} If validation fails
 */
function validateInput(inputData) {
  if (!Array.isArray(inputData)) {
    throw new Error("Input must be an array of 7 numerical GAD-7 scores");
  }

  if (inputData.length !== 7) {
    throw new Error("Input array must contain exactly 7 scores for GAD-7");
  }

  if (
    !inputData.every(
      (value) => typeof value === "number" && value >= 0 && value <= 3
    )
  ) {
    throw new Error("All scores must be numbers between 0 and 3");
  }
}

/**
 * Predicts anxiety severity based on GAD-7 responses
 * @param {Array<number>} inputData - Array of 7 GAD-7 scores
 * @returns {Promise<Object>} Prediction results
 */
export function predictGAD7(inputData) {
  return new Promise((resolve, reject) => {
    try {
      validateInput(inputData);

      const pythonProcess = spawn("python", [
        scriptPath,
        JSON.stringify(inputData),
      ]);

      let result = "";
      let stderrOutput = "";

      // Set timeout for Python process
      const timeout = setTimeout(() => {
        pythonProcess.kill();
        reject(new Error("Python process timed out"));
      }, 5000);

      // Handle stdout data
      pythonProcess.stdout.on("data", (data) => {
        result += data.toString();
      });

      // Handle stderr data
      pythonProcess.stderr.on("data", (data) => {
        stderrOutput += data.toString();
      });

      // Handle process completion
      pythonProcess.on("close", (code) => {
        clearTimeout(timeout);

        if (code !== 0) {
          return reject(
            new Error(
              `Python process exited with code ${code}. Stderr: ${stderrOutput}`
            )
          );
        }

        try {
          const prediction = JSON.parse(result);

          if (prediction.status === "error") {
            return reject(new Error(prediction.message));
          }

          resolve(prediction);
        } catch (parseError) {
          reject(
            new Error(
              `Failed to parse prediction result: ${parseError.message}`
            )
          );
        }
      });

      // Handle process errors
      pythonProcess.on("error", (error) => {
        clearTimeout(timeout);
        reject(new Error(`Failed to spawn Python process: ${error.message}`));
      });
    } catch (validationError) {
      reject(validationError);
    }
  });
}

// Example usage
async function example() {
  try {
    const gad7Input = [2, 1, 1, 3, 0, 2, 0]; // Example GAD-7 scores
    const result = await predictGAD7(gad7Input);
    console.log("GAD-7 Prediction result:", result);
  } catch (error) {
    console.error("Prediction failed:", error);
  }
}
