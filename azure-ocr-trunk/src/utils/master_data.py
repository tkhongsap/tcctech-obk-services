import requests
import json
import logging
import numpy as np
from src.config.config import load_config
from src.utils.general_function import generate_embeddings, generate_key, store_to_redis

config = load_config()
master_data_config = config.master_data_config()
logger = logging.getLogger(__name__)

property_param = {"id": master_data_config["PROPERTY_PARAM"]}
whitelist_param = {"property_id": master_data_config["PROPERTY_PARAM"]}
model_name = master_data_config["EMBEDDING_MODEL_NAME"]


def initialize_master_data():
    doc_res = requests.get(master_data_config["DOC_RES_URL"])
    sample_doc = json.loads(doc_res.text)
    doc_key = generate_key("document")
    sample_doc = store_to_redis(sample_doc, doc_key)

    logger.info("status: Successfully store document type to redis")

    property_res = requests.get(
        master_data_config["PROPERTY_RES_URL"], params=property_param
    )
    sample_property = json.loads(property_res.text)
    property_key = generate_key("property")
    sample_property = store_to_redis(sample_property, property_key)

    logger.info("status: Successfully store property to redis")

    whitelist_res = requests.get(
        master_data_config["WHITELIST_RES_URL"], params=whitelist_param
    )
    sample_whitelist = json.loads(whitelist_res.text)
    whitelist_key = generate_key("whitelist")
    sample_whitelist = store_to_redis(sample_whitelist, whitelist_key)

    embedded_whitelist = {"merchant_name": [], "company_name": []}
    merchant_name_whitelist = [
            whitelist["store_name"].lower()
            for whitelist in sample_whitelist
            if whitelist["store_name"].strip() != ''
        ]
    company_name_whitelist = [
        whitelist["company_name"].lower() 
        for whitelist in sample_whitelist
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

    logger.info("status: Successfully store whitelist to redis")

    sample_special_case = []
    for whitelist in sample_whitelist:
        if (
            whitelist["has_tax_id"] == False
            or whitelist["receipt_address_in_obk"] == False
        ):
            if whitelist["store_name"]:
                sample_special_case.append(whitelist["store_name"])

            if whitelist["company_name"]:
                sample_special_case.append(whitelist["company_name"])

    special_case_key = generate_key("special_case")
    sample_special_case = store_to_redis(sample_special_case, special_case_key)

    logger.info("status: Successfully store special case to redis")

    return (
        sample_doc,
        sample_property,
        sample_whitelist,
        sample_special_case,
        sample_embedded_whitelist,
    )


if __name__ == "__main__":
    initialize_master_data()
