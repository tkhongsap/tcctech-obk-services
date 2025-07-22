from fastapi import HTTPException
from src.core.validation import main_validation
from src.core.open_gpt import gpt_ocr

def gpt_main(source):
    extracted_receipts = gpt_ocr(source)
    if "status" in extracted_receipts and extracted_receipts["status"] == "invalid":
        raise HTTPException(
            status_code=extracted_receipts["http_status"], detail=extracted_receipts
        )
    raw_content = extracted_receipts.pop("raw_data")
    extracted_receipt = main_validation(extracted_receipts, raw_content)
    
    return extracted_receipt