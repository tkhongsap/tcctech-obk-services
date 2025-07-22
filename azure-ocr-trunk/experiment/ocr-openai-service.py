import os
import sys
import json
import base64
import time
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv # type: ignore
from os import environ
from openai import OpenAI
import io
import concurrent.futures
from functools import lru_cache

# Load environment variables
load_dotenv()
openai_api_key = environ.get("OPENAI_API_KEY")

if not openai_api_key:
    print("Error: OPENAI_API_KEY is not set in environment variables")
    sys.exit(1)

# Ensure proper UTF-8 handling
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Initialize OpenAI client
client = OpenAI(api_key=openai_api_key)

# Define paths
input_dir = Path(__file__).resolve().parent / "data/inputs/receipt_images"
output_dir = Path(__file__).resolve().parent / "data/outputs/openai_service"

# Create output directory if it doesn't exist
output_dir.mkdir(parents=True, exist_ok=True)

# Test with multiple files - commented out for production use
# input_files = [
#     input_dir / "7eleven_Potch_01.jpg",
#     input_dir / "1738828911937654016708644032092 - Victor Lee.jpg"
# ]
# 
# # Verify files exist
# existing_files = [file for file in input_files if file.exists()]
# if not existing_files:
#     print(f"Error: No matching image files found in {input_dir}")
#     sys.exit(1)

# Process all images in the input directory
all_image_files = list(input_dir.glob("*.jpg")) + list(input_dir.glob("*.jpeg")) + list(input_dir.glob("*.png"))

if not all_image_files:
    print(f"Error: No image files found in {input_dir}")
    sys.exit(1)

print(f"Found {len(all_image_files)} image files to process")

# Cache the base64 encoded images to avoid repetitive encoding
@lru_cache(maxsize=100)
def encode_image_to_base64(image_path_str):
    """Encode image to base64 string with caching"""
    try:
        with open(image_path_str, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    except Exception as e:
        print(f"Error encoding image: {e}")
        return None

def analyze_receipt_image(image_path):
    """Analyze receipt image using OpenAI's GPT-4 Vision model"""
    
    # Encode image to base64 (using the string path for caching)
    base64_image = encode_image_to_base64(str(image_path))
    
    if not base64_image:
        return None
    
    # Prepare the prompt for receipt analysis
    prompt = """
    You are a specialized receipt analysis system. Analyze this receipt image and extract the following information in a structured format:
    
    1. Merchant Name: The name of the store or merchant (maintain original language including Thai script)
    2. Transaction Date: The date of the transaction in YYYY-MM-DD format
    3. Transaction Time: The time of the transaction in HH:MM:SS format
    4. Items Purchased: A list of items with their descriptions, quantities, and prices (maintain original language including Thai script)
    5. Total Price: The subtotal before tax/service charges
    6. Total Amount: The final amount paid
    7. Tax ID: The tax identification number (format as TAX#{number})
    8. Receipt Number: The receipt number or identifier (format as No#{number})
    
    For each field, provide a confidence score between 0 and 1, where 1 is highest confidence.
    
    IMPORTANT: Preserve all text in its original language, including Thai script. Do not translate Thai text to English.
    
    The output should be in this exact JSON structure:
    {
        "merchant_name": {
            "value": "Store Name",
            "confidence": 0.95
        },
        "transaction_date": {
            "value": "YYYY-MM-DD",
            "confidence": 0.95
        },
        "transaction_time": {
            "value": "HH:MM:SS",
            "confidence": 0.95
        },
        "items": [
            {
                "item": {
                    "value": "Product Description",
                    "confidence": 0.9
                },
                "quantity": {
                    "value": 1,
                    "confidence": 0.9
                },
                "price": {
                    "value": 100,
                    "confidence": 0.9
                }
            }
        ],
        "total": {
            "value": 100.0,
            "confidence": 0.95
        },
        "tax_id": {
            "value": "0107542000011",
            "confidence": 0.95
        },
        "receipt_no": {
            "value": "409",
            "confidence": 0.9
        }
    }
    
    Return the data in valid JSON format with this exact structure. Do not include any prefixes like "TAX#" or "No#" in the actual values for tax_id and receipt_no - just include the raw numbers or identifiers.
    """
    
    try:
        # Start time for tracking API call duration
        start_time = time.time()
        
        # Call the OpenAI API with standard Chat Completions
        # Using gpt-4o-mini for better performance while maintaining decent accuracy
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user", 
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}",
                                "detail": "high"
                            }
                        }
                    ]
                }
            ],
            max_tokens=1500,
            timeout=30  # Set timeout to 30 seconds to avoid hanging
        )
        
        # Track API call duration
        api_duration = time.time() - start_time
        print(f"API call took {api_duration:.2f} seconds")
        
        # Extract and parse the JSON response
        try:
            content = response.choices[0].message.content
            # Extract JSON portion if surrounded by markdown code blocks
            if "```json" in content and "```" in content:
                json_str = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                json_str = content.split("```")[1].split("```")[0].strip()
            else:
                json_str = content.strip()
            
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON response: {e}")
            print(f"Raw response: {content}")
            return None
            
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        return None

def process_image(image_path):
    """Process a single image and save the JSON result"""
    
    start_time = time.time()
    
    # Generate output filename with the same name as input file but with .json extension
    filename = image_path.stem
    output_file = output_dir / f"{filename}.json"
    
    # Analyze the receipt
    result = analyze_receipt_image(image_path)
    
    if result:
        # Format tax_id and receipt_no with prefixes
        if "tax_id" in result and "value" in result["tax_id"]:
            tax_id_value = result["tax_id"]["value"]
            if not tax_id_value.startswith("TAX#"):
                result["tax_id"]["value"] = f"TAX#{tax_id_value}"
        
        if "receipt_no" in result and "value" in result["receipt_no"]:
            receipt_no_value = result["receipt_no"]["value"]
            if not receipt_no_value.startswith("No#"):
                result["receipt_no"]["value"] = f"No#{receipt_no_value}"
                
        # Save the result as JSON
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False, indent=4)
        
        process_duration = time.time() - start_time
        print(f"Result saved to: {output_file} (took {process_duration:.2f} seconds)")
        return True
    else:
        return False

def process_images_parallel(image_paths, max_workers=3):
    """Process multiple images in parallel with real-time feedback"""
    successful = 0
    total = len(image_paths)
    completed = 0
    
    print(f"Processing {total} images with {max_workers} workers in parallel")
    
    # Process images in parallel with a ThreadPoolExecutor
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit all tasks and store the futures
        future_to_image = {executor.submit(process_image, image_path): image_path for image_path in image_paths}
        
        # Process results as they complete
        for future in concurrent.futures.as_completed(future_to_image):
            image_path = future_to_image[future]
            completed += 1
            
            try:
                result = future.result()
                if result:
                    successful += 1
                    print(f"[{completed}/{total}] Successfully processed: {image_path.name}")
                else:
                    print(f"[{completed}/{total}] Failed to process: {image_path.name}")
            except Exception as e:
                print(f"[{completed}/{total}] Error processing {image_path.name}: {e}")
    
    return successful, total

# Process all available images
if all_image_files:
    start_time = time.time()
    
    # For a small number of files, process them sequentially
    if len(all_image_files) <= 2:
        successful = 0
        total = len(all_image_files)
        
        print(f"Processing {total} images sequentially")
        
        for idx, image_path in enumerate(all_image_files, 1):
            print(f"\n[{idx}/{total}] Processing: {image_path.name}")
            if process_image(image_path):
                successful += 1
                print(f"[{idx}/{total}] Successfully processed: {image_path.name}")
            else:
                print(f"[{idx}/{total}] Failed to process: {image_path.name}")
    # For more files, use parallel processing
    else:
        successful, total = process_images_parallel(all_image_files)
    
    total_duration = time.time() - start_time
    print(f"\nProcessing completed. Successfully processed {successful}/{total} images.")
    print(f"Total processing time: {total_duration:.2f} seconds")
    print(f"Average time per image: {total_duration/total:.2f} seconds")





