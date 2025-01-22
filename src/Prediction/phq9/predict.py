import sys
import json
import joblib
import pandas as pd
import logging
import traceback
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Get script's directory
MODEL_PATH = os.path.join(BASE_DIR, 'phq9_model.joblib')
SCALER_PATH = os.path.join(BASE_DIR, 'scaler.joblib')
SEVERITY_MAPPING_PATH = os.path.join(BASE_DIR, 'severity_mapping.joblib')



# Set up logging
logging.basicConfig(level=logging.INFO)

# Load artifacts at the module level
logging.info("Loading model artifacts...")
try:
    MODEL = joblib.load(MODEL_PATH)
    SCALER = joblib.load(SCALER_PATH)
    SEVERITY_MAPPING = joblib.load(SEVERITY_MAPPING_PATH)
    logging.info("Artifacts loaded successfully.")
except Exception as e:
    logging.error(f"Failed to load artifacts: {e}")
    sys.exit(1)


def validate_input(input_data, expected_length=9):
    """Validate the input data."""
    if not isinstance(input_data, list):
        raise ValueError("Input data must be a list.")
    if len(input_data) != expected_length:
        raise ValueError(f"Input data must have {expected_length} elements.")
    if not all(isinstance(x, (int, float)) for x in input_data):
        raise ValueError("All elements in input data must be numbers.")


def predict(input_data):
    try:
        logging.info("Loading model artifacts...")
        logging.info("Artifacts loaded successfully.")

        # Validate input
        if len(input_data) != 9:
            raise ValueError("Input data must contain exactly 9 elements.")

        # Feature names
        feature_names = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9"]

        # Create a DataFrame with feature names
        input_df = pd.DataFrame([input_data], columns=feature_names)
        logging.info(f"Input DataFrame: {input_df}")

        # Scale the input data
        scaled_input = SCALER.transform(input_df)
        logging.info(f"Scaled input: {scaled_input}")

        # Make prediction
        prediction = MODEL.predict(scaled_input)
        logging.info(f"Raw prediction: {prediction}")

        # Reverse the mapping for prediction
        reversed_mapping = {v: k for k, v in SEVERITY_MAPPING.items()}
        severity = reversed_mapping.get(prediction[0], "Unmapped Severity")
        logging.info(f"Severity level: {severity}")

        return json.dumps({
            'status': 'completed',
            'raw_prediction': prediction.tolist()[0],
            'severity_level': severity
        })
    except Exception as e:
        logging.error(f"Prediction error: {str(e)}")
        logging.error(traceback.format_exc())
        return json.dumps({
            'status': 'error',
            'message': f"Error during prediction: {str(e)}",
            'traceback': traceback.format_exc()
        })

if __name__ == '__main__':
    try:
        # Read input from Node.js
        input_data = json.loads(sys.argv[1])
        print(predict(input_data))
    except Exception as e:
        logging.error(f"Error reading input: {e}")
        print(json.dumps({
            'status': 'error',
            'message': "Invalid input format."
        }))
