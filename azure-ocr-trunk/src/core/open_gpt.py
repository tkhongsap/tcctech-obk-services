from openai import BadRequestError
import json
from src.utils.instruction import instructions, CLEAN_JSON_FORMAT
from src.core.ocr_intel import safe_get_value
from src.utils.response import make_response
import hashlib
from json import JSONDecodeError
import re
import logging
from openai import AzureOpenAI
from src.config.config import load_config

config = load_config()
gpt_config = config.gpt_client()

model_name = gpt_config['GPT_MODELNAME']
deployment = gpt_config['GPT_DEPLOYMENT_NAME']

logger = logging.getLogger(__name__)

client = AzureOpenAI(
            api_version=gpt_config['GPT_API_VERSION'],
            azure_endpoint=gpt_config['AZ_OPEN_AI_ENDPOINT'],
            api_key=gpt_config['AZ_OPEN_AI_KEY'],
        )

def hashing(extracted_receipt):
    data_to_hash = (
        safe_get_value(extracted_receipt, "tax_id")
        + safe_get_value(extracted_receipt, "transaction_date")
        + safe_get_value(extracted_receipt, "transaction_time")
        + safe_get_value(extracted_receipt, "total")
        + safe_get_value(extracted_receipt, "receipt_no")
        + safe_get_value(extracted_receipt, "merchant_name")
    )

    hashed_receipt = hashlib.sha256(data_to_hash.encode("utf-8")).hexdigest()
    extracted_receipt["hashed_receipt"] = hashed_receipt

    return extracted_receipt


def gpt_post_processing(result: dict):
    # remove special character from tax id
    tax_id = result["tax_id"]
    if tax_id:
        value = result["tax_id"]
        digits_only = re.sub(r"\D", "", value)
        result["tax_id"] = digits_only if len(digits_only) == 13 else None

    unit_no = result["unit_no"]
    if not unit_no:
        match = re.search(
            r"\b(?:unit(?:\s+no)?|ห้องเลขที่)[\s:]*([^,;\n\s]*(?:\s+[^,;\n\s]*)*?)(?:\s+(?:ชั้น|floor|building|อาคาร)|$)",
            result["raw_data"],
            re.IGNORECASE,
        )
        unit_no = match.group(1).strip() if match else None
        result["unit_no"] = unit_no

    mall_name = result["mall_name"]
    if not mall_name:
        match = re.search(
            r"(?:^|\s)(obk|one\s*bangkok|onebangkok|วันแบงคอก)(?:\s|$)",
            result["raw_data"],
            re.IGNORECASE,
        )
        mall_name = match.group(1) if match else None
        result["mall_name"] = mall_name
    return result


def clean_json_format(json_data):
    """Clean and format the JSON data according to the specified format"""
    response = client.responses.create(
        model=model_name,
        input=[
            {
                "role": "user",
                "content": [
                    {"type": "input_text", "text": CLEAN_JSON_FORMAT},
                    {"type": "input_text", "text": json_data},
                ],
            }
        ],
        temperature=0,
        top_p=1,
    )
    result = json.loads(response.output[0].content[0].text)
    return result

def get_default_result():
    """Return default result structure"""
    return {
        "merchant_name": None,
        "transaction_date": None,
        "transaction_time": None,
        "items": [],
        "total": None,
        "tax_id": None,
        "receipt_no": None,
        "address": None,
        "unit_no": None,
        "mall_name": None,
        "raw_data": "",
    }

def is_empty_receipt(extracted_receipt):
    """Check if the extracted receipt is empty (every keys are None)"""
    default_result = get_default_result()
    return all(
        value is None or value == "" or value == [] for value in extracted_receipt.values()
    ) or extracted_receipt == default_result

def gpt_ocr(source):
    """
    Use GPT to extract receipt information from an image URL.
    Args:
        source (str): The URL of the image containing the receipt.
    Returns:
        dict: A dictionary containing the extracted receipt information.
    """
    logger.info(f"Starting OCR extraction for source: {source}")
    try:
        response = client.responses.create(
            model=model_name,
            input=[
                {
                    "role": "user",
                    "content": [
                        {"type": "input_text", "text": instructions},
                        {"type": "input_image", "image_url": f"{source}"},
                    ],
                }
            ],
            temperature=0,
            top_p=1,
        )
        try:
            # pprint(response.output[0].content[0].text)
            result = json.loads(response.output[0].content[0].text)
        except JSONDecodeError as e:
            # Handle JSON decoding error
            logger.warning(f"JSON decode error, attempting to clean format: {e}")
            result = clean_json_format(response.output[0].content[0].text)
    except BadRequestError as e:
        # Handle specific BadRequestError from OpenAI
        logger.error(f"Invalid URL was given to GPT model {source}")
        return make_response(
            "invalid",
            400,
            "Bad request, Invalid URL was given",
            step="OCR_extraction",
        )
    except Exception as e:
        # Handle any other unexpected errors
        logger.error(f"Unexpected error: {type(e).__name__}: {e}")
        return make_response(
            "invalid",
            400,
            "Bad request, Invalid URL was given",
            step="OCR_extraction",
        )
    try:
        if is_empty_receipt(result):
            return make_response(
                "invalid",
                400,
                "Bad request, Invalid image input was given",
                step="OCR_extraction",
            )
        result = hashing(result)
        post_processed_result = gpt_post_processing(result)
        logger.info(f"Extracted successfully {post_processed_result}")
        return post_processed_result
    except Exception as e:
        logger.error(f"Error while processing the result: {e}")
        return result


if __name__ == "__main__":
    result = gpt_ocr(source="https://i.ibb.co/BFjg7rP/Rise-Coffee-T-Off-03.jpg")
