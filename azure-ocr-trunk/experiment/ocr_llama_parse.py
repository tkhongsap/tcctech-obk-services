from pathlib import Path
import os
from dotenv import load_dotenv
from llama_parse import LlamaParse
import json
import time
from datetime import datetime, timedelta

from instructions import llama_parse_instruction

load_dotenv(override=True)

BASE_DIR = Path(__file__).resolve().parent
INPUT_DIR = BASE_DIR / "data" / "inputs" / "receipt_images"
OUTPUT_DIR = BASE_DIR / "data" / "outputs" / "llama_parse_service"


INPUT_DIR.parent.mkdir(parents=True, exist_ok=True)
INPUT_DIR.mkdir(exist_ok=True)

def format_time(seconds):
    """แปลงเวลาเป็นรูปแบบ HH:MM:SS"""
    return str(timedelta(seconds=int(seconds)))

def get_supported_image_files():
    """Get all supported image files from INPUT_DIR"""
    supported_extensions = {'.jpg', '.jpeg', '.png', '.pdf'}
    image_files = []
    
    try:
        for file in INPUT_DIR.glob('*'):
            if file.suffix.lower() in supported_extensions:
                image_files.append(file)
        return image_files
    except Exception as e:
        print(f"Error getting file list: {str(e)}")
        return []

def process_single_file(file_path):
    """Process a single file"""
    try:
        print(f"Processing file: {file_path.name}")
        return llama_parse(str(file_path))
    except Exception as e:
        print(f"Error processing file {file_path.name}: {str(e)}")

def process_all_files():
    """Process all files in INPUT_DIR"""
    image_files = get_supported_image_files()
    
    if not image_files:
        print("No supported image files found in INPUT_DIR")
        return
    
    total_files = len(image_files)
    print(f"Found {total_files} files to process")
    
    results = []
    total_start_time = time.time()
    processing_times = []
    
    for idx, file_path in enumerate(image_files, 1):
        print(f"\nProcessing file {idx}/{total_files}: {file_path.name}")
        file_start_time = time.time()
        
        result = process_single_file(file_path)
        
        file_end_time = time.time()
        processing_time = file_end_time - file_start_time
        processing_times.append((file_path.name, processing_time))
        
        print(f"Time taken for {file_path.name}: {format_time(processing_time)}")
        
        if result:
            # สร้างชื่อไฟล์ output จากชื่อไฟล์ input
            output_file = OUTPUT_DIR / f"{file_path.stem}.json"
            
            # บันทึกผลลัพธ์ลงไฟล์
            try:
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(result, f, ensure_ascii=False, indent=2)
                print(f"Saved result to: {output_file}")
            except Exception as e:
                print(f"Error saving result: {str(e)}")
            
            results.append(result)
        
        # รอสักครู่ก่อนประมวลผลไฟล์ถัดไป
        if idx < total_files:  # ไม่ต้องรอสำหรับไฟล์สุดท้าย
            time.sleep(2)
    
    total_end_time = time.time()
    total_time = total_end_time - total_start_time
    
    # แสดงสรุปเวลาที่ใช้
    print("\n=== Processing Time Summary ===")
    print(f"Total files processed: {total_files}")
    print(f"Total time taken: {format_time(total_time)}")
    print("\nTime taken per file:")
    for filename, proc_time in processing_times:
        print(f"{filename}: {format_time(proc_time)}")
    print(f"\nAverage time per file: {format_time(total_time/total_files)}")
    
    return results

def llama_parse(file_target, output_folder=None):
    if output_folder is None:
        output_folder = str(OUTPUT_DIR)
    print(f"Output folder: {output_folder}")

    try:
        # openai api key
        openai_api_key = os.getenv("open_ai_api_key")
        # llama cloud api key
        llama_cloud_api_key = os.getenv("llama_cloud_api_key")

        print(f"Starting parsing with input_dir: {file_target}")
        
        # Initialize LlamaParse
        parser = LlamaParse(
            api_key=llama_cloud_api_key,
            content_guideline_instruction=llama_parse_instruction,
            result_type="text",  # ใช้ text แทน json
            use_vendor_multimodal_model=True,
            vendor_multimodal_model_name="openai-gpt4o",
            vendor_multimodal_model_api_key=openai_api_key,
            verbose=True,
        )
        
        # Process the file
        result = parser.load_data(file_target)
        
        # ตรวจสอบและแสดงผลลัพธ์
        print(f"Raw result type: {type(result)}")
        
        if result and len(result) > 0:
            # ดึง JSON string จาก text field
            json_str = result[0].text
            
            # ลบ ```json และ ``` ออก
            json_str = json_str.replace('```json\n', '').replace('\n```', '')
            
            # แปลงเป็น dict
            parsed_result = json.loads(json_str)
            
            # ถ้าเป็น list ให้ดึง dict ด้านในออกมา
            if isinstance(parsed_result, list) and len(parsed_result) > 0:
                return parsed_result[0]
            return parsed_result
            
        return None
        
    except Exception as e:
        print(f"Error in ocr_llama_parse: {str(e)}")
        raise

def process_specific_file(filenames):
    """Process specific files from INPUT_DIR
    Args:
        filenames: list ของชื่อไฟล์ที่ต้องการประมวลผล (เช่น ['receipt1.jpg', 'receipt2.jpg'])
    """
    # สร้าง OUTPUT_DIR ถ้ายังไม่มี
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    results = []
    total_start_time = time.time()
    processing_times = []
    
    total_files = len(filenames)
    for idx, filename in enumerate(filenames, 1):
        print(f"\nProcessing file {idx}/{total_files}: {filename}")
        file_start_time = time.time()
        
        file_path = INPUT_DIR / filename
        if not file_path.exists():
            print(f"Error: File {filename} not found in {INPUT_DIR}")
            continue
            
        if file_path.suffix.lower() not in {'.jpg', '.jpeg', '.png', '.pdf'}:
            print(f"Error: File {filename} is not a supported format")
            continue
        
        try:
            print(f"Processing file: {file_path.name}")
            result = llama_parse(str(file_path))
            
            if result:
                # สร้างชื่อไฟล์ output
                output_file = OUTPUT_DIR / f"{file_path.stem}.json"
                
                # บันทึกผลลัพธ์
                try:
                    with open(output_file, 'w', encoding='utf-8') as f:
                        json.dump(result, f, ensure_ascii=False, indent=2)
                    print(f"Saved result to: {output_file}")
                except Exception as e:
                    print(f"Error saving result: {str(e)}")
                
                results.append(result)
            
        except Exception as e:
            print(f"Error processing file {file_path.name}: {str(e)}")
        
        file_end_time = time.time()
        processing_time = file_end_time - file_start_time
        processing_times.append((filename, processing_time))
        
        print(f"Time taken for {filename}: {format_time(processing_time)}")
        
        # รอสักครู่ก่อนประมวลผลไฟล์ถัดไป
        if idx < total_files:  # ไม่ต้องรอสำหรับไฟล์สุดท้าย
            time.sleep(2)
    
    total_end_time = time.time()
    total_time = total_end_time - total_start_time
    
    # แสดงสรุปเวลาที่ใช้
    print("\n=== Processing Time Summary ===")
    print(f"Total files processed: {total_files}")
    print(f"Total time taken: {format_time(total_time)}")
    print("\nTime taken per file:")
    for filename, proc_time in processing_times:
        print(f"{filename}: {format_time(proc_time)}")
    print(f"\nAverage time per file: {format_time(total_time/total_files)}")
    
    return results

if __name__ == "__main__":
    # ดึงไฟล์ทั้งหมดจาก INPUT_DIR
    files_to_process = [file.name for file in INPUT_DIR.glob('*') if file.suffix.lower() in {'.jpg', '.jpeg', '.png', '.pdf'}]
    print(f"Found {len(files_to_process)} files to process")
    process_specific_file(files_to_process)
