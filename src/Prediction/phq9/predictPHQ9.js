import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

// Get the current file's directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use the correct script path
const scriptPath = path.join(__dirname, "predict.py");

function validateInput(inputData) {
  if (!Array.isArray(inputData) || inputData.length !== 9) {
    throw new Error("Input must be an array of 9 numerical PHQ-9 scores.");
  }
  if (!inputData.every((value) => typeof value === "number")) {
    throw new Error("All elements in the input array must be numbers.");
  }
}

export function predictPHQ9(inputData) {
  return new Promise((resolve, reject) => {
    try {
      validateInput(inputData);
    } catch (validationError) {
      return reject(validationError);
    }

    const pythonProcess = spawn("python", [
      scriptPath,
      JSON.stringify(inputData),
    ]);

    let result = "";
    let stderrOutput = "";

    const timeout = setTimeout(() => {
      pythonProcess.kill();
      reject(new Error("Python process timed out"));
    }, 5000); // Timeout after 5 seconds

    pythonProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      stderrOutput += data.toString();
    });

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
        resolve(prediction);
      } catch (parseError) {
        reject(new Error("Failed to parse prediction result"));
      }
    });

    pythonProcess.on("error", (error) => {
      clearTimeout(timeout);
      reject(new Error(`Failed to spawn Python process: ${error.message}`));
    });
  });
}

// Example usage
async function example() {
  const sampleInput = [2, 1, 1, 3, 0, 2, 0, 3, 0]; // Example PHQ-9 scores

  try {
    const result = await predictPHQ9(sampleInput);
    console.log("Prediction result:", result);
  } catch (error) {
    console.error("Prediction failed:", error);
  }
}
