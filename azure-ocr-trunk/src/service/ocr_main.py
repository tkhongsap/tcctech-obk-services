from src.core.ocr_intel import extract_receipts, create_doc_intel_client
from src.core.azure_ai import az_content_understanding_analyze
from src.core.validation import main_validation
from src.utils.general_function import combine
import logging
from src.config.config import load_config

logger = logging.getLogger(__name__)


async def main(source: str):
    """
    Main function to extract receipts from a given source using Azure Document Intelligence.
    If the initial extraction does not yield all required fields, it will use Azure AI Content Understanding to fill in the gaps.
    """
    config = load_config()
    doc_intel_client = config.doc_intel_client()

    endpoint = doc_intel_client["ENDPOINT_S0_DOC_INT"]
    key = doc_intel_client["KEY_S0_DOC_INT"]

    doc_intel_client = create_doc_intel_client(endpoint, key)

    if type(source) == str:
        extracted_receipts, content = await extract_receipts(
            urls=source, document_intelligence_client=doc_intel_client
        )

    logger.info(
        f"status: Successfully extracted from document intelligence\nresult: {extracted_receipts[0]}"
    )

    keys_to_check = [
        "total",
        "transaction_date",
        "transaction_time",
        "tax_id",
        "merchant_name",
    ]

    if any(extracted_receipts[0][key] is None for key in keys_to_check):
        logger.info("status: Prepare to extract from azure ai")
        ai_extracted_receipts = await az_content_understanding_analyze(source)
        logger.info(
            f"status: Successfully extracted from azure ai\nresult: {ai_extracted_receipts}"
        )
        extracted_receipts = combine(extracted_receipts, ai_extracted_receipts)
        logger.info(
            f"status: Successfully combine results\nresult: {extracted_receipts[0]}"
        )
        
    for index, item in enumerate(extracted_receipts[0]["items"]):
        for key in item.keys():
            if key == "total_price" and item[key] != None:
                item[key] = str(item[key])
    
    if extracted_receipts[0]["total"]:
        extracted_receipts[0]["total"] = str(extracted_receipts[0]["total"])

    extracted_receipt = await main_validation(extracted_receipts[0], content)
    logger.info(
        f"status: Successfully validate the result\nresult: {extracted_receipt}"
    )

    return extracted_receipt


if __name__ == "__main__":
    main("https://i.ibb.co/HTXLxnTp/Hasul.png")
