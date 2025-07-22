import hashlib
import logging
import pickle
import requests
import json
import numpy as np
from src.config.config import load_config
from openai import AzureOpenAI
from src.utils.redis import generate_key, store_to_redis

logger = logging.getLogger(__name__)

config = load_config()

general_function_config = config.general_function_config()
property_param = {"id": general_function_config["PROPERTY_PARAM"]}
whitelist_param = {"property_id": general_function_config["PROPERTY_PARAM"]}
model_name = general_function_config["EMBEDDING_MODEL_NAME"]
api_version = general_function_config["EMBEDDING_MODEL_API_VERSION"]
endpoint = general_function_config["AZ_OPEN_AI_ENDPOINT"]
subscription_key = general_function_config["AZ_OPEN_AI_KEY"]


def generate_embeddings(text, model):
    client = AzureOpenAI(
        api_version=api_version,
        azure_endpoint=endpoint,
        api_key=subscription_key,
    )
    result = client.embeddings.create(input=text, model=model)
    return result.data


def combine(extracted_receipts, ai_extracted_receipts):
    """
    Combine the results from Document Intelligence and Azure AI Content Understanding.
    If a field is missing in the Document Intelligence results, it will be filled with the value from Azure AI Content Understanding.
    """
    if extracted_receipts[0]["total"] is None:
        extracted_receipts[0]["total"] = ai_extracted_receipts.get("total")

    if extracted_receipts[0]["transaction_date"] is None:
        extracted_receipts[0]["transaction_date"] = ai_extracted_receipts.get(
            "transaction_date"
        )

    if extracted_receipts[0]["transaction_time"] is None:
        extracted_receipts[0]["transaction_time"] = ai_extracted_receipts.get(
            "transaction_time"
        )

    if extracted_receipts[0]["receipt_no"] is None:
        extracted_receipts[0]["receipt_no"] = ai_extracted_receipts.get("receipt_no")

    if extracted_receipts[0]["merchant_name"] is None:
        extracted_receipts[0]["merchant_name"] = ai_extracted_receipts.get(
            "merchant_name"
        )

    if extracted_receipts[0]["tax_id"] is None:
        extracted_receipts[0]["tax_id"] = ai_extracted_receipts.get("tax_id")

    store_identify = extracted_receipts[0]["tax_id"]
    if not store_identify:
        store_identify = extracted_receipts[0]["merchant_name"]

    if not store_identify:
        store_identify = ""

    data_to_hash = (
        str(store_identify)
        + str(extracted_receipts[0]["transaction_date"])
        + str(extracted_receipts[0]["transaction_time"])
        + str(extracted_receipts[0]["total"])
    )

    hashed_receipt = hashlib.sha256(data_to_hash.encode("utf-8")).hexdigest()
    extracted_receipts[0]["hashed_receipt"] = hashed_receipt

    return extracted_receipts


def get_master_data(redis, data_field):
    """
    get master data from redis server
    """
    data_key = generate_key(data_field)
    cached_data = redis.get(data_key)

    try:
        sample_data = pickle.loads(cached_data)
        return sample_data
    except:
        if data_field == "property":
            data_res = requests.get(
                general_function_config[f"{data_field.upper()}_RES_URL"],
                params=property_param,
            )
            sample_data = json.loads(data_res.text)
            property_key = generate_key(data_field)
            sample_data = store_to_redis(sample_data, property_key)
            return sample_data

        if data_field == "whitelist":
            data_res = requests.get(
                general_function_config[f"{data_field.upper()}_RES_URL"],
                params=whitelist_param,
            )
            sample_data = json.loads(data_res.text)
            whitelist_key = generate_key(data_field)
            sample_data = store_to_redis(sample_data, whitelist_key)
            return sample_data

        data_res = requests.get(
            general_function_config[f"{data_field.upper()}_RES_URL"]
        )
        sample_data = json.loads(data_res.text)
        doc_key = generate_key(data_field)
        sample_data = store_to_redis(sample_data, doc_key)
        return sample_data


def get_embedded_whitelist(redis, whitelist_data):
    data_key = generate_key("embedded")
    cached_data = redis.get(data_key)

    try:
        sample_data = pickle.loads(cached_data)
        return sample_data
    except:
        embedded_whitelist = {"merchant_name": [], "company_name": []}
        merchant_name_whitelist = [
            whitelist["store_name"].lower()
            for whitelist in whitelist_data
            if whitelist["store_name"].strip() != ''
        ]
        company_name_whitelist = [
            whitelist["company_name"].lower() 
            for whitelist in whitelist_data
            if whitelist["company_name"].strip() != ''
        ]

        embedded_store_name = generate_embeddings(merchant_name_whitelist, model_name)
        for store_name in embedded_store_name:
            embedded_store_name = np.array(store_name.embedding).reshape(1, -1)
            embedded_whitelist["merchant_name"].append(embedded_store_name)

        embedded_company_name = generate_embeddings(company_name_whitelist, model_name)
        for company_name in embedded_company_name:
            embedded_company_name = np.array(company_name.embedding).reshape(1, -1)
            embedded_whitelist["company_name"].append(embedded_company_name)

        embedded_whitelist_key = generate_key("embedded")
        sample_embedded_whitelist = store_to_redis(
            embedded_whitelist, embedded_whitelist_key
        )
        return sample_embedded_whitelist


def get_special_case_data(redis, whitelist_data):
    """
    get special case master data from redis
    """
    data_key = generate_key("special_case")
    cached_data = redis.get(data_key)

    try:
        sample_data = pickle.loads(cached_data)
        return sample_data
    except:
        sample_special_case = []
        for whitelist in whitelist_data:
            if (
                whitelist["has_tax_id"] == False
                or whitelist["receipt_address_in_obk"] == False
            ):
                if whitelist["store_name"]:
                    sample_special_case.append(whitelist["store_name"].lower())

                if whitelist["company_name"]:
                    sample_special_case.append(whitelist["company_name"].lower())

        special_case_key = generate_key("special_case")
        sample_special_case = store_to_redis(sample_special_case, special_case_key)
        return sample_special_case
