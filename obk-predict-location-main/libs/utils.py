import pandas as pd
import numpy as np
import joblib 

def group_feature(df, num_features, geometry=False, train=False):
    # features = df.loc[:, df.columns[9]: df.columns[-1]].copy()  # Adjust columns as per your 
    features = df.drop(columns=['timestamp', 'locationID', 'longitude', 'latitude', 'buildingNumber', 'floorNumber', 'accuracy'], errors='ignore')
    if train:
        features = df.loc[:, df.columns[3]: df.columns[-1]].copy()  # Adjust columns as per your 

    features.fillna(100, inplace=True)  # Fill missing values with 100 (signal strength)
    features[features == 100] = 0  
    features = features.abs() * 100   # Absolute value and multiply by 1000
    X = features
    grouped_columns = np.array_split(X.columns, num_features)
    aggregated_data = pd.DataFrame({
        f'group_{i}': X[cols].mean(axis=1) for i, cols in enumerate(grouped_columns)})
    if geometry:
        aggregated_data['x'] = df['x']
        aggregated_data['y'] = df['y']
        aggregated_data['z'] = df['z']
        aggregated_data['magnitude'] = (aggregated_data['x']**2 + aggregated_data['y']**2 + aggregated_data['z']**2)**0.5
        aggregated_data['horizontal_magnitude'] = (aggregated_data['x']**2 + aggregated_data['y']**2)**0.5
        aggregated_data['wifi_magnitude_ratio'] = aggregated_data['magnitude'] / (X.mean(axis=1) + 1e-6)
        # columns_to_multiply = aggregated_data.columns[:16]  # Assuming 0-31 are the first 32 columns
        # aggregated_data[columns_to_multiply] = aggregated_data[columns_to_multiply].multiply(aggregated_data['wifi_magnitude_ratio'], axis=0)
        # aggregated_data = aggregated_data.drop(columns=['x','y','z'])
    return aggregated_data

def transform_wifi_data_with_bssids(df, bssids, train=False):
    """
    Transforms Wi-Fi signal data into a structured DataFrame where each unique BSSID
    is represented as a column, and rows correspond to unique locations.
    
    Parameters:
        df (pd.DataFrame): Input DataFrame with columns 'BSSID', 'level', and location details.
        
    Returns:
        pd.DataFrame: Transformed DataFrame with BSSID columns and filled NaN values.
    """
    df = df.drop_duplicates()
    bssid_array = bssids['BSSID'].to_numpy()
    if not set(df['BSSID']).intersection(set(bssid_array)):
        raise ValueError("Error: No matching wifi signal found.")
    
        # Step 1: Create the pivot table, using 'BSSID' as the columns
    pivot_df = df.pivot(
        index=['x', 'y', 'z'],
        columns='BSSID', values='level'
    ).reset_index()
    # Step 3: Reindex the pivot table to ensure all BSSID columns are present, even if some BSSIDs are missing
    pivot_df = pivot_df.reindex(columns=['x', 'y', 'z'] + list(bssid_array), fill_value=100)
    
    # Step 4: Fill NaN values with 100 (or you can choose a different value like NaN, based on your needs)
    pivot_df.fillna(100, inplace=True)
    
    if train: 
        # Step 1: Create the pivot table, using 'BSSID' as the columns
        pivot_df = df.pivot(
            index=['timestamp','locationID', 'x', 'y', 'z', 'longitude', 'latitude', 'buildingNumber', 'floorNumber'],
            columns='BSSID', values='level'
        ).reset_index()
        # Step 3: Reindex the pivot table to ensure all BSSID columns are present, even if some BSSIDs are missing
        pivot_df = pivot_df.reindex(columns=['timestamp','locationID', 'x', 'y', 'z', 'longitude', 'latitude', 'buildingNumber', 'floorNumber'] + list(bssid_array), fill_value=100)
        
        # Step 4: Fill NaN values with 100 (or you can choose a different value like NaN, based on your needs)
        pivot_df.fillna(100, inplace=True)
    
    return pivot_df

def predict(features, predict_model):
    """
    Predict building and floor based on features.

    Parameters:
        features (pd.DataFrame): Preprocessed features for prediction.
        predict_model: Trained model for predicting building and floor.

    Returns:
        np.ndarray: Predicted building and floor.
    """
    try:
        return predict_model.predict(features)
    except Exception as e:
        print(f"Error during building prediction: {e}")
        raise

def scale_features(features, model_name, num_features):
    scaler = joblib.load(rf'assets/scaler_{model_name}.pkl')
    physical_scaler = joblib.load(rf'assets/physical_scaler_{model_name}.pkl')

    columns_to_multiply = features.columns[:num_features] 
    physical_features_scaled = physical_scaler.transform(features[['x', 'y', 'z', 'magnitude', 'horizontal_magnitude']])

    X = scaler.transform(features[columns_to_multiply])
    X = pd.DataFrame(np.hstack([X, physical_features_scaled]))
    return X

def scale_outputs(long, lat, model_name):
    scalerLat = joblib.load(rf'assets/scalerLat_{model_name}.pkl')
    scalerLong = joblib.load(rf'assets/scalerLong_{model_name}.pkl')
    long_original = scalerLong.inverse_transform(long)
    lat_original = scalerLat.inverse_transform(lat)
    return np.round(long_original, decimals=7), np.round(lat_original, decimals=7)

def map_floor_labels(labels):
    """
    Maps a list of floor labels using a predefined mapping table.
    
    Args:
        labels (list): List of original floor labels to be mapped.
        
    Returns:
        list: List of mapped floor labels.
    """
    # Define the mapping table inside the function
    floor_mapping = {
        "LG": "0",
        "L1": "1",
        "L2": "2",
        "L3": "3",
        "L4": "4",
        "L5": "5",
        "L6": "6",
        "L7": "7",
        "L8": "8",
        "L9": "9",
        "L10": "10",
        "B1M": "-1",
        "B1": "-2",
        "B2": "-3",
        "B3": "-4",
        "B4": "-5",
        "B5": "-6",
        "District" : "0"
    }

    return [floor_mapping.get(label, label) for label in labels]