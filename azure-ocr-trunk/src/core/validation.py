import json
from fastapi import HTTPException
from datetime import datetime, timedelta
import logging
import requests
from src.utils.response import make_response
from src.utils.general_function import (
    get_master_data,
    get_special_case_data,
    get_embedded_whitelist,
    generate_embeddings,
)
from src.utils.compare_sim import compare_sim
from src.utils.redis import r
from pprint import pprint
import zoneinfo
from src.config.config import load_config

logger = logging.getLogger(__name__)
config = load_config()
validation_config = config.validation_config()

model_name = validation_config["EMBEDDING_MODEL_NAME"]
cached_expire_time = int(validation_config["CACHED_EXPIRE_TIME"])


def rv2_mall_name(extracted_receipt):
    if extracted_receipt["mall_name"]:
        sample_property = get_master_data(r, "property")
        line_split = extracted_receipt["mall_name"].split("\n")
        all_words = " ".join([line.lower() for line in line_split])

        for keyword in sample_property[0]["keywords"]:
            if keyword.lower() in all_words:
                return True
    return False


def rv2_address(extracted_receipt):
    if extracted_receipt["address"]:
        sample_property = get_master_data(r, "property")
        keywords = list(
            map(lambda x: x.lower(), sample_property[0]["addresses"])
        )

        line_split = extracted_receipt["address"].split("\n")
        space_split = [line.split(" ") for line in line_split]

        all_words = [word.lower() for line in space_split for word in line if word.strip()]

        for word in all_words:
            word = word.lower()
            if (
                word in " ".join(keywords)
                or word in keywords
            ):
                return True
    return False


def rv2_special_case(max_index):
    sample_whitelist = get_master_data(r, "whitelist")
    sample_special_case = get_special_case_data(r, sample_whitelist)
    merchant_name_to_check = sample_whitelist[max_index]["store_name"].lower()
    company_name_to_check = sample_whitelist[max_index]["company_name"].lower()
    if (merchant_name_to_check in sample_special_case) or (
        company_name_to_check in sample_special_case
    ):
        return True
    else:
        return False


def ocv1(extracted_receipt):
    if (
        extracted_receipt["transaction_date"]
        and extracted_receipt["transaction_time"]
        and extracted_receipt["total"]
    ) and (extracted_receipt["tax_id"] or extracted_receipt["merchant_name"]):
        return True

    return make_response(
        "invalid",
        422,
        "Could not read required information from receipt.",
        step="ocv1",
        extracted_data=extracted_receipt,
    )


def rv1(extracted_receipt):
    sample_whitelist = get_master_data(r, "whitelist")
    sample_embedded_whitelist = get_embedded_whitelist(r, sample_whitelist)
    sample_embedded_merchant_whitelist = sample_embedded_whitelist["merchant_name"]
    sample_embedded_company_whitelist = sample_embedded_whitelist["company_name"]

    sample_tax_id = []

    for whitelist in sample_whitelist:
        if whitelist["tax_id"]:
            sample_tax_id.append(whitelist["tax_id"])
        else:
            sample_tax_id.append('no_tax_id')

    if extracted_receipt["tax_id"] and len(extracted_receipt["tax_id"]) == 13:
        for idx in range(len(sample_tax_id)):
            if extracted_receipt["tax_id"] == sample_tax_id[idx]:
                return True, idx

    if extracted_receipt["merchant_name"]:
        embedded_merchant_name = generate_embeddings(
            extracted_receipt["merchant_name"].lower(), model_name
        )
        result, max_index = compare_sim(
            sample_embedded_merchant_whitelist,
            sample_embedded_company_whitelist,
            embedded_merchant_name,
        )
        if max_index == "invalid":
            return (
                make_response(
                    "invalid",
                    422,
                    step="rv1",
                    message="Receipt is not from a participating store.",
                    extracted_data=extracted_receipt,
                ),
                "invalid",
            )

        return result, max_index
    else:
        return (
            make_response(
                "invalid",
                422,
                step="rv1",
                message="Receipt is not from a participating store.",
                extracted_data=extracted_receipt,
            ),
            "invalid",
        )


def rv2(extracted_receipt, max_index):
    if extracted_receipt['mall_name']:
        if rv2_mall_name(extracted_receipt):
            return True
    if extracted_receipt['address']:
        if rv2_address(extracted_receipt):
            return True
    return True if rv2_special_case(max_index) else make_response(
        "invalid",
        422,
        "Receipt location not recognized as One Bangkok.",
        step="rv2",
        extracted_data=extracted_receipt,
    )


def rv3(extracted_receipt):
    today = datetime.now(zoneinfo.ZoneInfo("Asia/Bangkok")).date()
    rv3_time_delta = int(validation_config["RV3_TIME_DELTA"])

    transaction_date = datetime.strptime(
        extracted_receipt["transaction_date"], "%Y-%m-%d"
    ).date()
    min_date = today - timedelta(days=rv3_time_delta)

    if transaction_date >= min_date and transaction_date <= today:
        return True
    else:
        return make_response(
            "invalid",
            422,
            "Receipt is too old to redeem.",
            step="rv3",
            extracted_data=extracted_receipt,
        )


def rv4(extracted_receipt):
    history_param = {
        "receipt_hashed_id": extracted_receipt["hashed_receipt"],
        "status": "REDEEMED",
    }
    history_res = requests.get(
        validation_config["HISTORY_RES_URL"], params=history_param
    )
    history = json.loads(history_res.text)

    if len(history) > 0:
        return make_response(
            "invalid",
            422,
            "This receipt has already been redeemed.",
            step="rv4",
            extracted_data=extracted_receipt,
        )

    return True


def rv5(extracted_receipt, extracted_receipt_content):
    if extracted_receipt_content and extracted_receipt_content != "":
        sample_doc = get_master_data(r, "doc")
        line_split = extracted_receipt_content.split("\n")
        space_split = [line.split(" ") for line in line_split]
        all_words = [
            word.lower() for line in space_split for word in line if word.strip()
        ]

        for doc in sample_doc:
            keyword = doc["keyword"].lower()
            if (keyword in " ".join(all_words) or keyword in all_words) and doc[
                "type"
            ].lower() in ["receipt","receipts"]:
                return True

    return make_response(
        "invalid",
        422,
        "Invalid document type for redemption.",
        step="rv5",
        extracted_data=extracted_receipt,
    )


async def main_validation(extracted_receipt, content):
    
    if not isinstance(extracted_receipt, dict):
        response = make_response(
            "invalid", 400, "Invalid input format", step="main_validation"
        )
        raise HTTPException(status_code=response["http_status"], detail=response)

    # Run pre-check
    ocv_result = ocv1(extracted_receipt)
    if ocv_result != True:
        raise HTTPException(status_code=ocv_result["http_status"], detail=ocv_result)

    # Run validations
    rv1_result, max_index = rv1(extracted_receipt)
    if max_index == "invalid":
        raise HTTPException(status_code=rv1_result["http_status"], detail=rv1_result)

    rv2_result = rv2(extracted_receipt, max_index)
    if rv2_result != True:
        raise HTTPException(status_code=rv2_result["http_status"], detail=rv2_result)

    rv3_result = rv3(extracted_receipt)
    if rv3_result != True:
        raise HTTPException(status_code=rv3_result["http_status"], detail=rv3_result)

    rv4_result = rv4(extracted_receipt)
    if rv4_result != True:
        raise HTTPException(status_code=rv4_result["http_status"], detail=rv4_result)

    rv5_result = rv5(extracted_receipt, content)
    if rv5_result != True:
        raise HTTPException(status_code=rv5_result["http_status"], detail=rv5_result)

    extracted_receipt["status"] = "valid"
    extracted_receipt["message"] = "valid"
    extracted_receipt["remarks"] = []

    for key in extracted_receipt.keys():
        if not extracted_receipt[key] and key != "remarks":
            extracted_receipt["remarks"].append(key)
            
    for index, item in enumerate(extracted_receipt["items"]):
        for key in item.keys():
            if item[key] == None or item[key] == "":
                extracted_receipt["remarks"].append(f"items_{key}_{index}")

    return extracted_receipt


if __name__ == "__main__":
    valid_ocr_data = {
        "merchant_name": "Albedo",
        "transaction_date": "2025-01-22",
        "transaction_time": "13:04",
        "items": [
            {"description": "Immunity", "quantity": 1, "total_price": 0.0},
            {"description": "แพ็คปกติ", "quantity": 1, "total_price": 0.0},
            {"description": "Immunity Classic", "quantity": 1, "total_price": 105.0},
        ],
        "total": 105.0,
        "tax_id": "01075670004",
        "receipt_no": "0225034 Q#31",
        "address": "",
        "unit_no": None,
        "mall_name": "sdfsdfdfsf",
        "hashed_receipt": "e871aa28f7d14bc2ffcabc6bb73a0098da8b8e3b0eb42e5ae43927cd240c12ef",
    }

    result = main_validation(valid_ocr_data, "receipt")
    pprint(result)
