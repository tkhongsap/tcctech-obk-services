import os
from azure.core.credentials import AzureKeyCredential
from azure.storage.blob import BlobServiceClient, generate_blob_sas, BlobSasPermissions
from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.ai.documentintelligence.models import AnalyzeDocumentRequest, AnalyzeResult
import json
from datetime import datetime, timedelta, timezone
import pandas as pd
from dotenv import dotenv_values
import hashlib

config = dotenv_values(".env")

doc_int_endpoint = config["endpoint_s0_doc_int"]
key = config["key_s0_doc_int"]
connect_str = config["blob_connection_string"]
sas_url = config["blob_service_sas_url"]
container_name = config["container_name"]

"""
Analyze receipts dataset store in blob storage.
"""


def format_currency(currency_value):
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


def extract_receipts(
    document_intelligence_client, urls: str = None, bytes_source: bytes = None
):
    """
    There is a logic that calculate discount and status which implement this only for poc
    in production we will not use this logic since it's consider only one receipt
    """

    if urls:
        poller = document_intelligence_client.begin_analyze_document(
            "prebuilt-receipt",
            AnalyzeDocumentRequest(url_source=urls[1]),
            string_index_type="Utf16CodeUnit",
            features=["queryFields", "languages", "ocrHighResolution"],
            query_fields=["Tax_Id", "Receipt_No"],
        )
    elif bytes:
        poller = document_intelligence_client.begin_analyze_document(
            "prebuilt-receipt",
            AnalyzeDocumentRequest(bytes_source=bytes_source),
            string_index_type="Utf16CodeUnit",
            features=["queryFields", "languages", "ocrHighResolution"],
            query_fields=["Tax_Id", "Receipt_No"],
        )

    receipts: AnalyzeResult = poller.result()

    receipts_data = []

    if receipts.documents:
        for receipt in receipts.documents:
            receipt_data = {
                "merchant_name": None,
                "transaction_date": None,
                "transaction_time": None,
                "items": [],
                "total": None,
                "tax_id": None,
                "receipt_no": None,
                "address": None,
                "discount": 0,
                "status": False,
                "hashed_receipt": None,
            }

            if receipt.fields:
                merchant_name = receipt.fields.get("MerchantName")
                if merchant_name:
                    receipt_data["merchant_name"] = {
                        "value": merchant_name.get("valueString"),
                        "confidence": merchant_name.get("confidence"),
                    }

                transaction_date = receipt.fields.get("TransactionDate")
                if transaction_date:
                    receipt_data["transaction_date"] = {
                        "value": transaction_date.get("valueDate"),
                        "confidence": transaction_date.get("confidence"),
                    }
                transaction_time = receipt.fields.get("TransactionTime")
                if transaction_time:
                    receipt_data["transaction_time"] = {
                        "value": transaction_time.get("valueTime"),
                        "confidence": transaction_time.get("confidence"),
                    }

                receipt_no = receipt.fields.get("Receipt_No")
                if receipt_no:
                    receipt_data["receipt_no"] = {
                        "value": receipt_no.get("valueString"),
                        "confidence": receipt_no.get("confidence"),
                    }

                address = receipt.fields.get("MerchantAddress")
                if address:
                    receipt_data["address"] = {
                        "value": address.get("content"),
                        "confidence": address.get("confidence"),
                    }

                items = receipt.fields.get("Items")
                if items:
                    for item in items.get("valueArray", []):
                        item_data = {}

                        item_description = item.get("valueObject", {}).get(
                            "Description"
                        )
                        if item_description:
                            item_data["description"] = {
                                "value": item_description.get("valueString"),
                                "confidence": item_description.get("confidence"),
                            }

                        item_quantity = item.get("valueObject", {}).get("Quantity")
                        if item_quantity:
                            item_data["quantity"] = {
                                "value": item_quantity.get("valueNumber"),
                                "confidence": item_quantity.get("confidence"),
                            }

                        item_total_price = item.get("valueObject", {}).get("TotalPrice")
                        if item_total_price:
                            item_data["total_price"] = {
                                "value": format_currency(
                                    item_total_price.get("valueCurrency")
                                ),
                                "confidence": item_total_price.get("confidence"),
                            }

                        receipt_data["items"].append(item_data)

                total = receipt.fields.get("Total")
                if total:
                    receipt_data["total"] = {
                        "value": format_currency(total.get("valueCurrency")),
                        "confidence": total.get("confidence"),
                    }

                tax_id = receipt.fields.get("Tax_Id")
                if tax_id:
                    receipt_data["tax_id"] = {
                        "value": tax_id.get("valueString"),
                        "confidence": tax_id.get("confidence"),
                    }

                # this logic is calculate only for poc
                if receipt_data["total"]:
                    total_amount = receipt_data["total"]["value"]
                    if total_amount:
                        if total_amount >= 5000:
                            receipt_data["discount"] = 8
                        elif total_amount >= 2000:
                            receipt_data["discount"] = 6
                        elif total_amount >= 500:
                            receipt_data["discount"] = 4
                        else:
                            receipt_data["discount"] = 0

                data_to_hash = (
                    safe_get_value(receipt_data, "tax_id")
                    + safe_get_value(receipt_data, "transaction_date")
                    + safe_get_value(receipt_data, "transaction_time")
                    + safe_get_value(receipt_data, "total")
                )
                hashed_receipt = hashlib.sha256(
                    data_to_hash.encode("utf-8")
                ).hexdigest()
                receipt_data["hashed_receipt"] = hashed_receipt

                if (
                    receipt_data["transaction_date"] is None
                    or receipt_data["transaction_date"].get("value") is None
                    or receipt_data["transaction_time"] is None
                    or receipt_data["transaction_time"].get("value") is None
                    or receipt_data["total"] is None
                    or receipt_data["total"].get("value") is None
                    or receipt_data["tax_id"] is None
                    or receipt_data["tax_id"].get("value") is None
                ):
                    receipt_data["status"] = False
                    receipt_data["discount"] = 0
                else:
                    receipt_data["status"] = True

            receipts_data.append(receipt_data)

    filename = f"{urls[0]}.json"
    os.makedirs("./extracts", exist_ok=True)
    os.makedirs("./extracts-raw", exist_ok=True)
    processed_output_file = os.path.join("./extracts", filename)
    raw_output_file = os.path.join("./extracts-raw", filename)

    # save processed json
    with open(processed_output_file, "w", encoding="utf-8") as outfile:
        json.dump(receipts_data, outfile, indent=4, ensure_ascii=False)

    # save raw json
    with open(raw_output_file, "w", encoding="utf-8") as outfile:
        json.dump(receipts.as_dict(), outfile, indent=4, ensure_ascii=False)
    return receipts_data


def get_blob_sas_urls(connect_str, container_name):
    blob_service_client = BlobServiceClient.from_connection_string(connect_str)
    container_client = blob_service_client.get_container_client(container_name)

    blob_names = [blob.name for blob in container_client.list_blobs()]

    urls = {}
    for blob_name in blob_names:
        blob_client = container_client.get_blob_client(blob_name)

        sas_token = generate_blob_sas(
            account_name=blob_service_client.account_name,
            container_name=container_name,
            blob_name=blob_name,
            account_key=blob_service_client.credential.account_key,
            permission=BlobSasPermissions(read=True),
            expiry=datetime.now(timezone.utc) + timedelta(hours=1),
        )

        sas_url = f"{blob_client.url}?{sas_token}"
        urls[blob_name] = sas_url

    return urls


def main():
    document_intelligence_client = DocumentIntelligenceClient(
        endpoint=doc_int_endpoint, credential=AzureKeyCredential(key)
    )
    urls = get_blob_sas_urls(connect_str, container_name)
    time_per_img = []
    for url in urls.items():
        start_time = datetime.now()
        extract_receipts(document_intelligence_client, url)
        end_time = datetime.now()
        elapsed_time = end_time - start_time
        time_per_img.append(elapsed_time.total_seconds())

    execution_time_df = pd.DataFrame({"Seconds": time_per_img})
    execution_time_df.to_csv(
        f'exceution_time_{datetime.now().strftime("%Y_%m_%d_%H_%M_%S")}.csv'
    )


if __name__ == "__main__":
    main()
