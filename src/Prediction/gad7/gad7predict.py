import sys
import json
import joblib
import pandas as pd
import logging
import traceback

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Load artifacts at the module level
try:
    MODEL = joblib.load('gad7_model.joblib')
    SCALER = joblib.load('gad7_scaler.joblib')
    ANXIETY_MAPPING = joblib.load('anxiety_mapping.joblib')
    logging.info("GAD-7 model artifacts loaded successfully")
except Exception as e:
    logging.error(f"Failed to load GAD-7 artifacts: {e}")
    sys.exit(1)


def validate_input(input_data):
    """Validate the GAD-7 input data."""
    if not isinstance(input_data, list):
        raise ValueError("Input data must be a list")

    if len(input_data) != 7:
        raise ValueError("GAD-7 requires exactly 7 responses")

    if not all(isinstance(x, (int, float)) and 0 <= x <= 3 for x in input_data):
        raise ValueError("All responses must be numbers between 0 and 3")


def predict(input_data):
    """Make predictions using the GAD-7 model."""
    try:
        # Validate input
        validate_input(input_data)

        # Create DataFrame with feature names
        feature_names = [f"q{i}" for i in range(1, 8)]
        input_df = pd.DataFrame([input_data], columns=feature_names)
        logging.info(f"Input DataFrame: {input_df}")

        # Scale the input data
        scaled_input = SCALER.transform(input_df)
        logging.info(f"Scaled input: {scaled_input}")

        # Make prediction
        prediction = MODEL.predict(scaled_input)
        logging.info(f"Raw prediction: {prediction}")

        # Calculate total score
        total_score = sum(input_data)

        # Get anxiety level
        reversed_mapping = {v: k for k, v in ANXIETY_MAPPING.items()}
        anxiety_level = reversed_mapping.get(prediction[0], "Unmapped Level")

        return json.dumps({
            'status': 'success',
            'raw_prediction': prediction.tolist()[0],
            'anxiety_level': anxiety_level,
            'total_score': total_score,
            'responses': input_data
        })

    except Exception as e:
        logging.error(f"Prediction error: {str(e)}")
        logging.error(traceback.format_exc())
        return json.dumps({
            'status': 'error',
            'message': str(e),
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
            'message': f"Invalid input format: {str(e)}"
        }))