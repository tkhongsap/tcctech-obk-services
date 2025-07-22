__all__ = ['llama_parse_instruction', 'extract_keys_user_prompt']

llama_parse_instruction = """
You are an expert in extracting structured information from receipts.
Your task is to extract and structure information into a specific JSON format.
Ensure all the required keys are included, even if the information is missing (use `null` or empty values as appropriate).

Required JSON format:
[
    {
        "merchant_name": {
            "value": "string",
            "confidence": number
        },
        "transaction_date": {
            "value": "DD-MM-YYYY",
            "confidence": number
        },
        "transaction_time": {
            "value": "HH:MM:SS",
            "confidence": number
        },
        "items": [
            {
                "description": {
                    "value": "string",
                    "confidence": number
                },
                "quantity": {
                    "value": number,
                    "confidence": number
                },
                "total_price": {
                    "value": number,
                    "confidence": number
                }
            }
        ],
        "total": {
            "value": number,
            "confidence": number
        },
        "tax_id": {
            "value": "string or null",
            "confidence": number
        },
        "receipt_no": {
            "value": "string",
            "confidence": number
        },
        "address": "string or null",
        "discount": number,
        "status": boolean,
        "hashed_receipt": "string"
    }
]

Notes:
- Extract all values along with their confidence scores.
- If a field is missing or not found, set `"value": null` and `"confidence": 0`.
- Ensure date format follows `YYYY-MM-DD` and time format follows `HH:MM:SS`.
- The `status` field should be `false` by default unless specified otherwise.
- The system should be able to process receipts in various languages, including Thai, and handle language-specific nuances in parsing.
- If no keys can be extracted from the receipt, return the following error message:
{
    "error": "Receipt data is missing. Please provide a receipt for extraction."
}
"""



extract_keys_user_prompt = """Extract structured information from this receipt:

{parsed_content}
"""

