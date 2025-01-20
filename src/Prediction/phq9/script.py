import joblib

# Path to your joblib file
file_path = 'severity_mapping.joblib'

# Load the file
severity_mapping = joblib.load(file_path)

# Print the contents
print("Contents of severity_mapping.joblib:")
print(severity_mapping)
