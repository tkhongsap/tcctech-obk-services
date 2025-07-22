import unittest
from datetime import datetime, timedelta
from src.core.validation import ocv1


class TestOCV(unittest.TestCase):
    def setUp(self):
        self._now = datetime.now()
        self.today = self._now.strftime("%Y-%m-%d")
        self.yesterday = (self._now - timedelta(days=1)).strftime("%Y-%m-%d")
        self.tomorrow = (self._now + timedelta(days=1)).strftime("%Y-%m-%d")
        self.valid_ocr_data = {
            "merchant_name": "Dean & Deluca", 
            "transaction_date": self.today, 
            "transaction_time": "14:04", 
            "items": [
                {"description": "Iced Americano - Floral", "quantity": 1, "total_price": 55.0}
            ],
            "total": 55.0, 
            "tax_id": "0105551096261", 
            "receipt_no": "10344001022500156", 
            "address": "lumpini", 
            "unit_no": None, 
            "mall_name": "One Bangkok",
            "hashed_receipt": "54241a863f9bdf7760556e4b68c49659bfacf4c7715513125451c45d6297b59d", 
        }
        self.invalid_case_response = {
            "status": "invalid",
            "http_status": 422,
            "message": "Could not read required information from receipt.",
            "step": "ocv1",
            "extracted_data": self.valid_ocr_data
        }


    # Pass case
    # valid with tax_id
    def test_valid_receipt_with_tax_id(self):
        """Test when all required fields including tax_id are present."""
        self.valid_ocr_data["merchant_name"] = None
        result = ocv1(self.valid_ocr_data)
        self.assertTrue(result)
        
    
    # Pass case
    # valid with merchant_name
    def test_valid_receipt_with_merchant_name(self):
        """Test when all required fields including merchant_name are present."""
        self.valid_ocr_data["tax_id"] = None
        result = ocv1(self.valid_ocr_data)
        self.assertTrue(result)
        
    
    # Pass case
    # valid with both tax_id and merchant_name
    def test_valid_receipt_with_both_identifiers(self):
        """Test when all required fields including both identifiers are present."""
        result = ocv1(self.valid_ocr_data)
        self.assertTrue(result)
        
    
    # Not pass case
    # 1 of transaction_date, transaction_time, total, receipt_no is None
    def test_invalid_receipt_missing_required_fields(self):
        """Test when required fields are missing or None."""
        required_fields = [
            "transaction_date",
            "transaction_time",
            "total",
            "receipt_no"
        ]
        for field in required_fields:
            with self.subTest(missing_field=field):
                self.valid_ocr_data[field] = None
                result = ocv1(self.valid_ocr_data)
                self.assertEqual(result, self.invalid_case_response)
                
    
    # Not pass case
    # tax_id and merchant_name are None
    def test_invalid_receipt_missing_identifiers(self):
        """Test when both tax_id and merchant_name are None."""
        self.valid_ocr_data["tax_id"] = None
        self.valid_ocr_data["merchant_name"] = None
        result = ocv1(self.valid_ocr_data)
        self.assertEqual(result, self.invalid_case_response)
        
    
    # Not pass case
    # all mandatory fields are None
    def test_mandatory_fields_are_none(self):
        """Test when all mandatory fields are None."""
        self.valid_ocr_data["transaction_date"] = None
        self.valid_ocr_data["transaction_time"] = None
        self.valid_ocr_data["total"] = None
        self.valid_ocr_data["receipt_no"] = None
        self.valid_ocr_data["tax_id"] = None
        self.valid_ocr_data["merchant_name"] = None

        result = ocv1(self.valid_ocr_data)
        self.assertEqual(result, self.invalid_case_response)
        

    # Not pass case
    # all mandatory fields are empty strings
    def test_mandatory_fields_are_empty_strings(self):
        """Test when all mandatory fields are empty strings."""
        self.valid_ocr_data["transaction_date"] = ""
        self.valid_ocr_data["transaction_time"] = ""
        self.valid_ocr_data["total"] = ""
        self.valid_ocr_data["receipt_no"] = ""
        self.valid_ocr_data["tax_id"] = ""
        self.valid_ocr_data["merchant_name"] = ""

        result = ocv1(self.valid_ocr_data)
        self.assertEqual(result, self.invalid_case_response)
        

if __name__ == "__main__":
    unittest.main()
