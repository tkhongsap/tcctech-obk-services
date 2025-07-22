import requests
import logging
from src.config.config import load_config

logger = logging.getLogger(__name__)
config = load_config()
instruction_config = config.instruction_config()
property_param = {"id": instruction_config["PROPERTY_PARAM"]}


def get_address_and_keywords_from_property_name(property_param):
    property_lists = requests.get(
        instruction_config["PROPERTY_RES_URL"], params=property_param
    ).json()
    addresses = []
    keywords = []
    addresses = property_lists[0].get("addresses", [])
    keywords = property_lists[0].get("keywords", [])
    # break
    if addresses == [] and keywords == []:
        logger.error(
            f"{property_param} is invalid property id, Please check your 'PROPERTY_PARAM' in .env file"
        )
    return addresses, keywords


addresses, keywords = get_address_and_keywords_from_property_name(property_param)

JSON_STRUCTURE = """{
   'merchant_name': , 
   'transaction_date': , 
   'transaction_time': , 
   'items': [{'description': , 'quantity': , 'total_price': }], 
   'total': , 
   'tax_id': , 
   'receipt_no': , 
   'address': , 
   'unit_no': , 
   'mall_name': ,
   'raw_data':
}"""

instructions = f"""
Read the following receipt and extract the following information as a JSON object like this sample structure:
If the input is not a receipt image, return sample structure with None in every keys.
If the input is not a receipt image, add None value in key 'raw_data'.

{JSON_STRUCTURE}


** The date time format should be in YYYY-MM-DD and HH:MM format.**
** The quantity should be a number.**
** Look for the words {keywords} for mall_name if it presence in receipt. **
** Look for the words {addresses} for address if it presence in receipt. **
** Clean tax_id if it has any special characters or spaces.**

**Please do not include any other information in the JSON object.**
**Return only the JSON object.**
**Fields that are not present or cannot be extracted in the receipt leave it None.**
** No comma inside a number. ex. 1,797.00 should be 1797.00**
** No '\n' in the JSON object.**
** No ```json in the response**
** No indentation**
** Every keys should be string format include total_price and total**

Also please extracted the raw data in the receipt (all the text in receipt) as a single string
value of the key name 'raw_data'

Note:
1. If the input is not a receipt image, return sample structure with None in every keys.
2. If the input is not a receipt image, add None value in key 'raw_data'.
3. make sure json object is contained every keys, align with the sample structure.
{JSON_STRUCTURE}
"""

CLEAN_JSON_FORMAT = """
Fix and return a valid JSON object from a potentially broken or malformed JSON-like string.

Rules:
1. Fix common JSON syntax errors:
   - Missing or extra commas
   - Unescaped or misused quotes
   - Incorrect or mismatched brackets/braces
   - Malformed or misspelled keys (e.g., "quantit ty" -> "quantity")
   - Extra characters that break JSON structure

2. Ensure the final output is syntactically valid JSON.

3. Format requirements:
   - All keys and string values must be enclosed in double quotes (")
   - Numerical fields (e.g., quantity, total_price, total) must be numbers, not strings
   - Do not include newline characters (\n) or unnecessary spaces in values
   - Numbers must not include commas (e.g., use 1797.00 not 1,797.00)

4. Field rules:
   - Do not add or infer new fields that are not present
   - Do not delete any existing fields unless absolutely necessary to fix structure
   - Leave fields with missing data as null or None (as appropriate for JSON)

5. Return only the corrected JSON object as a string.
   - Do not include any extra commentary, code blocks, or formatting (e.g., no triple backticks)

Intended use case:
Use this function to clean and correct JSON output from OCR or LLMs that may have formatting issues before parsing or storing.
"""


if __name__ == "__main__":
    addresses, keywords = get_address_and_keywords_from_property_name("one bangkok")
    print(addresses)
    print(keywords)
