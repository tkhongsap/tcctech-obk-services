from azure.core.credentials import AzureKeyCredential
from azure.ai.documentintelligence.models import AnalyzeDocumentRequest, AnalyzeResult
from azure.ai.documentintelligence import DocumentIntelligenceClient
import hashlib
import logging
import re
from datetime import datetime
from dateutil import parser
from src.utils.response import make_response

from fastapi import HTTPException

logger = logging.getLogger(__name__)


def _is_date_format_valid(date_string):
    """Check if the date string is in the format 'YYYY-MM-DD'."""
    try:
        datetime.strptime(date_string, "%Y-%m-%d")
        return True
    except (ValueError, TypeError):
        return False


def check_and_parse_date(date_string: str):
    """
    Check if a date string is 'YYYY-MM-DD' format.
    If not, Parse a date string and return it in 'YYYY-MM-DD' format.
    If the date string is not in the correct format, return None.
    but if a date string is already in the 'YYYY-MM-DD' format, return it as is.
    """
    if not _is_date_format_valid(date_string):
        try:
            # Try to parse the date string using dateutil.parser
            dt = parser.parse(date_string, dayfirst=True)
            return dt.strftime("%Y-%m-%d")
        except (ValueError, TypeError):
            return None
    else: # ใส่ else เผื่อกรณีที่ไม่มี valueDate (transaction_date.get("valueDate") ไม่มีค่า) แต่ date_string เป็น 'YYYY-MM-DD' format
        return date_string


def extract_and_convert_time(text):
    pattern = r"\b\d{1,2}:\d{2}(?::\d{2})?\s*(?:[AaPp]\.?[Mm]\.?)?[a-zA-Z]*"

    matches = re.findall(pattern, text)
    converted_times = []

    for time_str in matches:
        match = re.match(
            r"(?P<time>\d{1,2}:\d{2}(?::\d{2})?)\s*(?P<ampm>[AaPp]\.?[Mm]\.?)?",
            time_str,
        )
        if not match:
            continue

        time_part = match.group("time")
        ampm_part = match.group("ampm")

        time_normalized = re.sub(r"(:\d{2})(?::\d{2})", r"\1", time_part)
        if ampm_part:
            ampm_cleaned = ampm_part.replace(".", "").upper()
            time_normalized = f"{time_normalized} {ampm_cleaned}"

        try:
            if ampm_part:
                dt = datetime.strptime(time_normalized, "%I:%M %p")
            else:
                dt = datetime.strptime(time_normalized, "%H:%M")

            converted_times.append(dt.strftime("%H:%M"))
        except ValueError:
            continue

    return converted_times[0]


def create_doc_intel_client(endpoint, key):
    document_intelligence_client = DocumentIntelligenceClient(
        endpoint=endpoint, credential=AzureKeyCredential(key)
    )
    return document_intelligence_client


def format_currency(currency_value):
    """
    Format the currency value to a string
    """
    if currency_value:
        return currency_value.amount
    return None


# Safe concatenation method
def safe_get_value(data, key):
    """
    Safely extract value from nested dictionary or handle None

    Args:
        data (dict): The dictionary to extract value from
        key (str): The key to look up

    Returns:
        str: The value as a string, or empty string if not found
    """
    if data is None or key not in data:
        return ""

    # For nested dictionaries with 'value' key
    if isinstance(data[key], dict):
        return str(data[key].get("value", "") or "")

    # For direct values or None
    return str(data[key] or "")


async def extract_receipts(
    document_intelligence_client, urls: str = None, bytes_source: bytes = None
):
    """
    There is a logic that calculate discount and status which implement this only for poc
    in production we will not use this logic since it's consider only one receipt
    """

    if urls:
        # If the source is a URL, use the URL to extract receipts
        try:
            poller = document_intelligence_client.begin_analyze_document(
                "prebuilt-receipt",
                AnalyzeDocumentRequest(url_source=urls),
                string_index_type="Utf16CodeUnit",
                features=[
                    "queryFields",
                ],
                query_fields=["Tax_Id", "Receipt_No", "Mall_Name", "Unit_No"],
            )
        except:
            response = make_response(
                "invalid",
                400,
                "Bad request, Invalid URL was given",
                step="OCR_extraction",
            )
            raise HTTPException(status_code=response["http_status"], detail=response)
    elif bytes:
        # If the source is bytes, use the bytes to extract receipts
        poller = document_intelligence_client.begin_analyze_document(
            "prebuilt-receipt",
            AnalyzeDocumentRequest(bytes_source=bytes_source),
            string_index_type="Utf16CodeUnit",
            features=[
                "queryFields",
            ],
            query_fields=["Tax_Id", "Receipt_No", "Mall_Name", "Unit_No"],
        )

    receipts: AnalyzeResult = poller.result()

    receipts_data = []

    if receipts.documents and receipts.documents[0]:
        for receipt in receipts.documents:
            # receipt.fields is a dictionary of fields extracted from the receipt
            receipt_data = {
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
                "hashed_receipt": None,
            }

            if receipt.fields:
                merchant_name = receipt.fields.get("MerchantName")
                if merchant_name:
                    receipt_data["merchant_name"] = merchant_name.get("valueString")

                transaction_date = receipt.fields.get("TransactionDate")
                if transaction_date:
                    if transaction_date.get("valueDate"):
                        receipt_data["transaction_date"] = transaction_date.get("valueDate")
                    
                    else:
                        receipt_data["transaction_date"] = check_and_parse_date(
                            transaction_date.get("content")
                        )
                    
                transaction_time = receipt.fields.get("TransactionTime")
                if transaction_time:
                    try:
                        receipt_data["transaction_time"] = extract_and_convert_time(
                            receipts.documents[0].fields["TransactionTime"].content
                        )
                    except:
                        receipt["transaction_time"] = None

                receipt_no = receipt.fields.get("Receipt_No")
                if receipt_no:
                    receipt_data["receipt_no"] = receipt_no.get("valueString")

                address = receipt.fields.get("MerchantAddress")
                if address:
                    receipt_data["address"] = address.get("content")

                match = re.search(
                    r"\b(?:unit(?:\s+no)?|ห้องเลขที่)[\s:]*([^\n,;]*)",
                    receipts.content,
                    re.IGNORECASE,
                )
                unit_no = match.group(1).strip() if match else None
                if unit_no:
                    receipt_data["unit_no"] = unit_no

                match = re.search(
                    r"\b(one\s+bangkok)\b", receipts.content, re.IGNORECASE
                )
                mall_name = match.group(1) if match else None
                if mall_name:
                    receipt_data["mall_name"] = mall_name

                items = receipt.fields.get("Items")
                if items:
                    for item in items.get("valueArray", []):
                        item_data = {}

                        item_description = item.get("valueObject", {}).get(
                            "Description"
                        )
                        if item_description:
                            item_data["description"] = item_description.get(
                                "valueString"
                            )

                        item_quantity = item.get("valueObject", {}).get("Quantity")
                        if item_quantity:
                            item_data["quantity"] = item_quantity.get("valueNumber")
                        else:
                            item_data["quantity"] = None

                        item_total_price = item.get("valueObject", {}).get("TotalPrice")
                        if item_total_price:
                            item_data["total_price"] = format_currency(
                                item_total_price.get("valueCurrency")
                            )

                        receipt_data["items"].append(item_data)

                total = receipt.fields.get("Total")
                if total:
                    receipt_data["total"] = format_currency(total.get("valueCurrency"))

                tax_id = receipt.fields.get("Tax_Id")
                if tax_id:
                    value = tax_id.get("valueString")
                    match = re.search(r"\d+", value or "")
                    receipt_data["tax_id"] = match.group() if match else None

                data_to_hash = (
                    safe_get_value(receipt_data, "tax_id")
                    + safe_get_value(receipt_data, "transaction_date")
                    + safe_get_value(receipt_data, "transaction_time")
                    + safe_get_value(receipt_data, "total")
                    + safe_get_value(receipt_data, "merchant_name")
                )

                hashed_receipt = hashlib.sha256(
                    data_to_hash.encode("utf-8")
                ).hexdigest()
                receipt_data["hashed_receipt"] = hashed_receipt

            receipts_data.append(receipt_data)
    else:
        raise HTTPException(
            status_code=400,
            detail=make_response(
                "invalid",
                400,
                "Bad request, Invalid image input was given",
                step="OCR_extraction",
            ),
        )

    return receipts_data, receipts.content
