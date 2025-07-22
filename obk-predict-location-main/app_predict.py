from flask import Flask, request, jsonify
import pandas as pd
from tensorflow.keras.models import load_model
import numpy as np
import joblib
from libs.utils import group_feature, transform_wifi_data_with_bssids, scale_features, scale_outputs, map_floor_labels
from werkzeug.exceptions import BadRequest
import os
from datetime import datetime
import json

class LocationPredictor:
    def __init__(self, app):
        self.app = app
        self.bssid_path = 'assets/unique_bssids.csv'
        self.model_path = 'models/model.h5'
        
        # Load resources
        self.bssid = pd.read_csv(self.bssid_path)
        self.location_model = load_model(self.model_path)
        self.label_encoder_building = joblib.load('assets/label_encoder_building.pkl')
        self.label_encoder_floor = joblib.load('assets/label_encoder_floor.pkl')
        
        # Initialize routes
        self.app.add_url_rule('/predict', view_func=self.predict, methods=['POST'])
        self.app.add_url_rule('/check', view_func=self.check_view, methods=['GET'])
        self.app.add_url_rule('/', view_func=self.home, methods=['GET'])
        self.app.add_url_rule('/logs', view_func=self.logs, methods=['GET'])

    def check_view(self):
        return "Check endpoint is working!"
    def home(self):
        return "LBS Predict Location Service"

    def logs(self):
        try:
            with open('log.json', 'r', encoding='utf-8') as file:
                data = json.load(file)
        except (FileNotFoundError, json.JSONDecodeError) as e:
            return jsonify({'error': str(e)}), 400  
        # Sort the data by timestamp in descending order
        data_sorted = sorted(data, key=lambda x: datetime.fromisoformat(x['requesttime']), reverse=False)
        return jsonify(data)

    def load_next_model(self, model_name):
        """
        Helper function to load the next model based on the dynamically generated name.
        """
        next_model_path = f"models/{model_name}_CNN.h5"
        if not os.path.exists(next_model_path):
            raise FileNotFoundError(f"Location model not found: {next_model_path}")
        return load_model(next_model_path)

    def predict(self):
        try:
            # Check if input is JSON
            if not request.is_json:
                return jsonify({"error": "Invalid input. Please input a JSON file."}), 400

            # Parse input JSON
            input_json = request.json
            input_data = pd.DataFrame(input_json)  # Assuming JSON input is a list of dictionaries
            processed_data = transform_wifi_data_with_bssids(input_data, self.bssid)

            # Aggregate features
            aggregated_data = group_feature(processed_data, 100,geometry=True)

            # Make predictions
            y_pred = self.location_model.predict(aggregated_data)

            # Decode predictions
            y_pred_building = np.argmax(y_pred[0], axis=1)
            y_pred_floor = np.argmax(y_pred[1], axis=1)

            building_pred_labels = self.label_encoder_building.inverse_transform(y_pred_building)
            floor_pred_labels = self.label_encoder_floor.inverse_transform(y_pred_floor)
            building_confidence = np.max(y_pred[0], axis=1)
            floor_confidence = np.max(y_pred[1], axis=1)

            # Dynamically create the model name
            building_pred_label = building_pred_labels[0]  # First label
            floor_pred_label = floor_pred_labels[0]  # First label
            model_name = f"{building_pred_label.lower()}_{floor_pred_label.upper()}"

            # Load the next model based on dynamically created model name
            bssid_path__ = f'assets/unique_bssids_{model_name}.csv'
            if not os.path.exists(bssid_path__):
                raise FileNotFoundError(f"BSSID file not found: {bssid_path__}")
            bssid__ = pd.read_csv(bssid_path__)

            # Process data with the new BSSID and make predictions
            processed_data = transform_wifi_data_with_bssids(input_data, bssid__)
            features = group_feature(processed_data, 40, geometry=True)
            features = scale_features(features, model_name,40)
            location_model__ = self.load_next_model(model_name)

            # Predict latitude and longitude
            predictions = location_model__.predict(features)

            # Separate predictions for longitude and latitude
            predicted_long = predictions[0]  # Longitude predictions
            predicted_lat = predictions[1]   # Latitude predictions
            long, lat = scale_outputs(predicted_long, predicted_lat, model_name)

            mapped_floor_labels = map_floor_labels(floor_pred_labels)

            # Prepare response
            response = {
                "predicted_buildings": [
                    {"label": label, "confidence": float(conf)}
                    for label, conf in zip(building_pred_labels, building_confidence)
                ],
                "predicted_floors": [
                    {"label": label, "confidence": float(conf)}
                    for label, conf in zip(mapped_floor_labels, floor_confidence)
                ],
                "latitude": float(lat),
                "longitude": float(long),
            }
            # log_data = {
            # 'requesttime': datetime.now().isoformat(), 
            # 'request': input_json, 
            # 'response': response,  
            # }
            # try:
            #     with open('log.json', 'r', encoding='utf-8') as log_file:
            #         log_entries = json.load(log_file)
            # except (FileNotFoundError, json.JSONDecodeError):
            #     log_entries = []
            # log_entries.append(log_data)
            # with open('log.json', 'w', encoding='utf-8') as log_file:
            #     json.dump(log_entries, log_file, ensure_ascii=False, indent=4)

            return jsonify(response)

        except BadRequest as e:
            return jsonify({"error": f"Bad request: {e.description}"}), 400
        except FileNotFoundError as e:
            return jsonify({"error": str(e)}), 404
        except Exception as e:
            return jsonify({"error": str(e)}), 500


# Initialize Flask app
app = Flask(__name__)

# Initialize LocationPredictor
location_predictor = LocationPredictor(app)

# Run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=7777)
