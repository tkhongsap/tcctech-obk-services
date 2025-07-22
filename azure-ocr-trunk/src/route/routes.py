from fastapi import APIRouter, status
from src.service.gpt_main import gpt_main
from src.service.ocr_main import main as ocr_main
import logging

router = APIRouter()

logger = logging.getLogger(__name__)

@router.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    """
    Health check endpoint to verify if the API is running.
    Returns a simple status message with 200 OK status code.
    """
    return {"status": "healthy", "message": "API is up and running"}


@router.post("/receipt-ocr")
async def read_receipt(source: str):
    """
    Endpoint to extract receipt information from a given source using OCR.
    """

    logger.info(f"Source: {source}")
    extracted_receipt = await ocr_main(source)
    logger.info("status: Successfully finish the whole OCR processes")

    return extracted_receipt


@router.post("/receipt-ocr-gpt")
def read_receipt_gpt(source: str):
    """
    Endpoint to extract receipt information from a given source using GPT 4.1 mini.
    """
    # Call the main function from ocr_main.py to extract receipt information
    logger.info(f"Source: {source}")
    extracted_receipt = gpt_main(source)
    logger.info(f"Extracted receipts: {extracted_receipt}")
    
    return extracted_receipt
