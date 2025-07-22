import os
import json
import csv
import glob
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Input and output paths - Updated to support multiple folders
input_dirs = [
    "data/outputs/ms_service_doc_intel_processed",
    "data/outputs/ms_service_openai",
    "data/outputs/openai_service",
    "data/outputs/llama_parse_service"
]

def format_items(items):
    """Format items from the receipt into a readable string"""
    if not items:
        return ""
    
    items_list = []
    for item in items:
        # Handle different item formats
        if "item" in item and isinstance(item["item"], dict) and "value" in item["item"]:
            item_name = item["item"]["value"]
        elif "description" in item and isinstance(item["description"], dict) and "value" in item["description"]:
            item_name = item["description"]["value"]
        else:
            item_name = "Unknown"
            
        # Handle quantity
        if "quantity" in item and isinstance(item["quantity"], dict) and "value" in item["quantity"]:
            quantity = item["quantity"]["value"]
        else:
            quantity = ""
            
        # Handle price
        if "price" in item and isinstance(item["price"], dict) and "value" in item["price"]:
            price = item["price"]["value"]
        elif "total_price" in item and isinstance(item["total_price"], dict) and "value" in item["total_price"]:
            price = item["total_price"]["value"]
        else:
            price = ""
        
        if quantity and price:
            items_list.append(f"{item_name} ({quantity} x {price})")
        elif price:
            items_list.append(f"{item_name} ({price})")
        else:
            items_list.append(item_name)
    
    return "; ".join(items_list)

def extract_value(data_dict, key):
    """Extract value from nested JSON structure safely"""
    if key in data_dict and isinstance(data_dict[key], dict) and "value" in data_dict[key]:
        return data_dict[key]["value"]
    return ""

def clean_tax_id(tax_id):
    """Clean tax ID by removing prefixes like TAX# if present"""
    if not tax_id:
        return ""
    
    # Remove common prefixes
    for prefix in ["TAX#", "TAX ID:", "TAX ID", "TAX: ", "TaxID:"]:
        if isinstance(tax_id, str) and tax_id.startswith(prefix):
            return tax_id[len(prefix):]
    
    return tax_id

def format_date_time(date_str, time_str):
    """Format date and time strings into a consistent format"""
    if not date_str:
        return ""
    
    try:
        # Parse date and time
        date_format = "%Y-%m-%d"
        date_obj = datetime.strptime(date_str, date_format)
        
        # Format datetime in the requested format (DD/MM/YYYY HH:MM)
        formatted_date = date_obj.strftime("%d/%m/%Y")
        
        # Add time if available
        if time_str:
            # Remove seconds if present
            if len(time_str) >= 8 and time_str[5:8] == ":00":
                time_str = time_str[:5]
            return f"{formatted_date} {time_str}"
        return formatted_date
    except ValueError:
        # Return original if parsing fails
        return f"{date_str} {time_str}" if time_str else date_str

def process_json_data(data, file_name):
    """Process JSON data regardless of structure and return a standardized dictionary"""
    # Check if data is a list - handle ms_service_doc_intel_processed format
    if isinstance(data, list) and len(data) > 0:
        # Use the first item in the list
        receipt_data = data[0]
    else:
        # Regular dictionary format
        receipt_data = data
    
    # Extract values from JSON
    tax_id = clean_tax_id(extract_value(receipt_data, "tax_id"))
    receipt_no = extract_value(receipt_data, "receipt_no")
    merchant_name = extract_value(receipt_data, "merchant_name")
    
    # Get financial information
    subtotal = extract_value(receipt_data, "subtotal") or ""
    tip = extract_value(receipt_data, "tip") or ""
    total = extract_value(receipt_data, "total") or extract_value(receipt_data, "total_amount") or ""
    
    # Get date and time
    date = extract_value(receipt_data, "transaction_date")
    time = extract_value(receipt_data, "transaction_time")
    transaction_datetime = format_date_time(date, time)
    
    # Get items
    items = format_items(receipt_data.get("items", []))
    
    # Return standardized dictionary
    return {
        'File': file_name,
        'TAX': tax_id,
        'Receipt Number': receipt_no,
        'MerchantName': merchant_name,
        'Subtotal': subtotal,
        'Tip': tip,
        'Total': total,
        'TransactionDateTime': transaction_datetime,
        'Items': items
    }

def process_json_files(input_dir):
    """Process all JSON files in a directory and write data to CSV"""
    # Generate output filename based on the input directory name
    dir_name = os.path.basename(input_dir)
    output_file = f"receipt_data_{dir_name}.csv"
    
    print(f"\nProcessing files from: {input_dir}")
    print(f"Output will be saved to: {output_file}")
    
    # Create CSV file with UTF-8 encoding and BOM to help with Excel compatibility
    with open(output_file, 'w', newline='', encoding='utf-8-sig') as csvfile:
        fieldnames = ['File', 'TAX', 'Receipt Number', 'MerchantName', 'Subtotal', 'Tip', 'Total', 'TransactionDateTime', 'Items']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        
        # Get all JSON files in the directory
        json_files = glob.glob(os.path.join(input_dir, "*.json"))
        
        if not json_files:
            print(f"No JSON files found in {input_dir}")
            return 0
            
        processed_count = 0
        
        for json_file in json_files:
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                # Extract file name
                file_name = os.path.basename(json_file)
                
                # Process the data
                row_data = process_json_data(data, file_name)
                
                # Write to CSV
                writer.writerow(row_data)
                
                processed_count += 1
                if processed_count % 20 == 0:
                    print(f"Processed: {processed_count} files...")
                
            except Exception as e:
                print(f"Error processing {json_file}: {str(e)}")
        
        print(f"Successfully processed {processed_count} files from {dir_name}")
        return processed_count

if __name__ == "__main__":
    try:
        print("Starting to process JSON files from multiple directories...")
        total_files = 0
        
        # Process each input directory
        for input_dir in input_dirs:
            # Check if directory exists
            if os.path.exists(input_dir):
                count = process_json_files(input_dir)
                total_files += count
            else:
                print(f"Directory not found: {input_dir}")
        
        print(f"\nTotal files processed across all directories: {total_files}")
        print("All outputs have been saved to their respective CSV files!")
    except Exception as e:
        print(f"An error occurred: {str(e)}") 