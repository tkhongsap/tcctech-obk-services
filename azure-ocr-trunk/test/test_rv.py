import unittest
from datetime import timedelta, date
from unittest.mock import patch, Mock
import json
from dotenv import dotenv_values
from src.core.validation import (
    rv1,
    rv2,
    rv3,
    rv4,
    rv5,
)


class TestRV(unittest.TestCase):
    """Test the RV module."""

    def setUp(self):
        """Set up test data."""
        self._now = date.today()
        self.today_date = self._now  # Keep as date object
        self.yesterday_date = self._now - timedelta(days=1)  # Keep as date object
        self.tomorrow_date = self._now + timedelta(days=1)  # Keep as date object
        # String versions for when you need them
        self.today = self._now.strftime("%Y-%m-%d")
        self.yesterday = self.yesterday_date.strftime("%Y-%m-%d")
        self.tomorrow = self.tomorrow_date.strftime("%Y-%m-%d")

        self.config = dotenv_values(".env")
        self.valid_ocr_data = {
            "merchant_name": "Thai yamazaki Co.,Ltd.", 
            "transaction_date": self.today, 
            "transaction_time": "14:04", 
            "items": [
                {"description": "Iced Americano - Floral", "quantity": 1, "total_price": 55.0}
            ],
            "total": 55.0, 
            "tax_id": "105527027239", 
            "receipt_no": "10344001022500156", 
            "address": "lumphini", 
            "unit_no": None, 
            "mall_name": "One Bangkok",
            "hashed_receipt": "54241a863f9bdf7760556e4b68c49659bfacf4c7715513125451c45d6297b59d", 
        }
        self.invalid_case_message = [
            "Receipt is not from a participating store.",
            "Receipt location not recognized as One Bangkok.",
            "Receipt is too old to redeem.",
            "This receipt has already been redeemed.",
            "Invalid document type for redemption.",
            "This hashed receipt is not valid."
        ]
        self.invalid_case_step = [
            "rv1",
            "rv2",
            "rv3",
            "rv4",
            "rv5"
        ]
        



    # RV-1 function ================================================================================================
    # Pass case
    # all fields are valid
    def test_rv1_successful_validation(self):
        """Test with all mandatory fields present and valid."""
        result, index = rv1(self.valid_ocr_data)
        self.assertEqual(result, True)
        self.assertIsInstance(index, int)

    # Pass case
    # tax_id is valid, but merchant_name is None
    def test_rv1_is_tax_id_in_whitelist(self):
        """Test if tax_id is in whitelist."""
        self.valid_ocr_data["merchant_name"] = None
        result, index = rv1(self.valid_ocr_data)
        self.assertEqual(result, True)
        self.assertIsInstance(index, int)

    # Pass case
    # tax_id is None, merchant_name (store) is valid
    def test_rv1_is_store_in_whitelist(self):
        """Test if merchant_name (store) is in whitelist."""
        self.valid_ocr_data["tax_id"] = None
        result, index = rv1(self.valid_ocr_data)
        self.assertEqual(result, True)
        self.assertIsInstance(index, int)

    # Pass case
    # tax_id is None, merchant_name (company name) is valid
    def test_rv1_is_company_in_whitelist(self):
        """Test if merchant_name (company) is in whitelist."""
        company_names = [
            "BSJ Production Co., Ltd.",
            "Thai yamazaki Co.,Ltd.",
            "บมจ.ปตท.น้ำมันและการค้าปลีก",
            "White Story"
        ]
        self.valid_ocr_data["tax_id"] = None
        for name in company_names:
            with self.subTest(merchant_name=name):
                self.valid_ocr_data["merchant_name"] = name
                result, index = rv1(self.valid_ocr_data)
                self.assertEqual(result, True)
                self.assertIsInstance(index, int)

    # Not pass case
    # tax_id and merchant_name are invalid values (not in whitelist and tax_id is not 13 digits)
    def test_rv1_fail_to_validate_invalid_value(self):
        """Test if tax_id and merchant_name are invalid values (not in whitelist)."""
        self.valid_ocr_data["tax_id"] = "Invalid value"
        self.valid_ocr_data["merchant_name"] = "Invalid value"
        result, index = rv1(self.valid_ocr_data)
        expected_response = {
            "status": "invalid",
            "http_status": 422,
            "message": self.invalid_case_message[0],
            "step": self.invalid_case_step[0],
            "extracted_data": self.valid_ocr_data
        }
        self.assertEqual(result, expected_response)

    # Not pass case
    # Test if tax_id is invalid and merchant_name are None.
    def test_rv1_invalid_tax_id_and_none_merchant(self):
        """Test if tax_id is invalid and merchant_name are None."""
        self.valid_ocr_data["tax_id"] = "1234567891234"
        self.valid_ocr_data["merchant_name"] = None
        result, index = rv1(self.valid_ocr_data)
        expected_response = {
            "status": "invalid",
            "http_status": 422,
            "message": self.invalid_case_message[0],
            "step": self.invalid_case_step[0],
            "extracted_data": self.valid_ocr_data
        }
        self.assertEqual(result, expected_response)

    # Not pass case
    # Test if tax_id is none and merchant_name is invalid.
    def test_rv1_tax_id_is_none_and_invalid_merchant(self):
        """Test if tax_id is none and merchant_name is invalid."""
        self.valid_ocr_data["tax_id"] = None
        self.valid_ocr_data["merchant_name"] = "Invalid name"
        result, index = rv1(self.valid_ocr_data)
        expected_response = {
            "status": "invalid",
            "http_status": 422,
            "message": self.invalid_case_message[0],
            "step": self.invalid_case_step[0],
            "extracted_data": self.valid_ocr_data
        }
        self.assertEqual(result, expected_response)

    # Not pass case
    # Test merchant name is Lim Lao Ngow Original, but not in one bangkok
    def test_rv1_fail_to_validate_lim_lao_ngow_original_not_in_one_bangkok(self):
        """Test if merchant name is Lim Lao Ngow Original, but not in One Bangkok (in whitelist is the praq)."""
        self.valid_ocr_data["tax_id"] = "0125560008744"  # tax_id of Lim Lao Ngow Original
        self.valid_ocr_data["merchant_name"] = "Lim Lao Ngow Original"
        result, index = rv1(self.valid_ocr_data)
        expected_response = {
            "status": "invalid",
            "http_status": 422,
            "message": self.invalid_case_message[0],
            "step": self.invalid_case_step[0],
            "extracted_data": self.valid_ocr_data
        }
        self.assertEqual(result, expected_response)
        self.assertEqual(index, "invalid")

    # RV-2 function ================================================================================================
    # 1.
    # Pass case
    # all fields are valid
    def test_rv2_valid_mall_name(self):
        """Test if mall name is valid"""
        result = rv2(self.valid_ocr_data, 0)
        self.assertEqual(result, True)

    # 2.
    # Pass case
    # mall name is invalid, but address is valid
    def test_rv2_invalid_mall_name_but_valid_address(self):
        """Test invalid mall name 'Invalid Mall' but valid address"""
        data = self.valid_ocr_data.copy()
        data["mall_name"] = "Invalid Mall"
        result = rv2(data, 0)
        self.assertEqual(result, True)

    # 3.
    # Pass case
    # mall name is empty string, but address is valid
    def test_rv2_invalid_mall_name_but_valid_address(self):
        """Test invalid mall name '' but valid address"""
        data = self.valid_ocr_data.copy()
        data["mall_name"] = ""
        result = rv2(data, 0)
        self.assertEqual(result, True)

    # 4.
    # Pass case
    # mall name is None, but address is valid
    def test_rv2_invalid_mall_name_but_valid_address_none(self):
        """Test invalid mall name None but valid address"""
        data = self.valid_ocr_data.copy()
        data["mall_name"] = None
        result = rv2(data, 0)
        self.assertEqual(result, True)

    # 5.
    # Pass case
    # Special case: mall name is invalid, but address is invalid
    def test_valid_special_case(self):
        """Test special case: mall name is invalid, but address is invalid"""
        data = self.valid_ocr_data.copy()
        data["tax_id"] = None
        data["mall_name"] = "Invalid Mall"
        data["address"] = "Invalid Address"
        data["merchant_name"] = "PIMS" # Special case store name
        rv1_result, index = rv1(data)
        result = rv2(data, index)
        self.assertEqual(result, True)

    # 6.
    # Pass case
    # mall name is None, but address is valid
    def test_rv2_mall_name_is_none_but_valid_address(self):
        """Test invalid mall name None but valid address"""
        data = self.valid_ocr_data.copy()
        data["mall_name"] = None
        result = rv2(data, 0)
        self.assertEqual(result, True)

    # 7.
    # Pass case
    # mall name is empty string, but address is valid
    def test_rv2_mall_name_is_empty_string_but_valid_address(self):
        """Test invalid mall name '' but valid address"""
        data = self.valid_ocr_data.copy()
        data["mall_name"] = ""
        result = rv2(data, 0)
        self.assertEqual(result, True)

    # 8.
    # Pass case
    # Special case: mall name is None, and address is invalid
    def test_rv2_mall_name_is_none_and_invalid_address(self):
        """Test invalid mall name None and address invalid"""
        data = self.valid_ocr_data.copy()
        data["tax_id"] = None
        data["mall_name"] = None
        data["address"] = "Invalid Address"
        data["merchant_name"] = "PIMS" # Special case store name
        rv1_result, index = rv1(data)
        result = rv2(data, index)
        self.assertEqual(result, True)

    # 9.
    # Not pass case
    # mall name is invalid, and address is invalid but not special case 
    def test_rv2_mall_name_is_invalid_and_invalid_address(self):
        """Test invalid mall name 'Invalid Mall' and address invalid"""
        self.valid_ocr_data["tax_id"] = None
        self.valid_ocr_data["mall_name"] = "Invalid Mall"
        self.valid_ocr_data["address"] = "Invalid Address"
        rv1_result, index = rv1(self.valid_ocr_data)
        result = rv2(self.valid_ocr_data, index)
        expected_response = {
            "status": "invalid",
            "http_status": 422,
            "message": self.invalid_case_message[1],
            "step": self.invalid_case_step[1],
            "extracted_data": self.valid_ocr_data
        }
        self.assertEqual(result, expected_response)

    # 10.
    # Pass case
    # Special case: Test special case mall name and address are none but special case
    def test_rv2_special_case_mall_name_and_address_are_none(self):
        """Test special case mall name and address are none"""
        self.valid_ocr_data["tax_id"] = None
        self.valid_ocr_data["mall_name"] = None
        self.valid_ocr_data["address"] = None
        self.valid_ocr_data["merchant_name"] = "PIMS" # Special case store name
        rv1_result, index = rv1(self.valid_ocr_data)
        result = rv2(self.valid_ocr_data, index)
        self.assertEqual(result, True)

    # 11.
    # Not pass case
    # Special case: mall name is None, and address is invalid but not special case
    def test_rv2_mall_name_is_none_and_invalid_address_but_not_special_case(self):
        """Test invalid mall name None and address invalid"""
        self.valid_ocr_data["tax_id"] = None
        self.valid_ocr_data["mall_name"] = None
        self.valid_ocr_data["address"] = "Invalid Address"
        rv1_result, index = rv1(self.valid_ocr_data)
        result = rv2(self.valid_ocr_data, index)
        expected_response = {
            "status": "invalid",
            "http_status": 422,
            "message": self.invalid_case_message[1],
            "step": self.invalid_case_step[1],
            "extracted_data": self.valid_ocr_data
        }
        self.assertEqual(result, expected_response)

    # 12.
    # Not pass case
    # mall name is None, and address is None
    def test_rv2_mall_name_and_address_are_none(self):
        """Test invalid mall name None and address None"""
        self.valid_ocr_data["mall_name"] = None
        self.valid_ocr_data["address"] = None
        result = rv2(self.valid_ocr_data, 0)
        expected_response = {
            "status": "invalid",
            "http_status": 422,
            "message": self.invalid_case_message[1],
            "step": self.invalid_case_step[1],
            "extracted_data": self.valid_ocr_data
        }
        self.assertEqual(result, expected_response)

    # 13.
    # Not pass case
    # mall name is empty string, and address is empty string
    def test_rv2_mall_name_and_address_are_empty_string(self):
        """Test invalid mall name '' and address ''"""
        self.valid_ocr_data["mall_name"] = ""
        self.valid_ocr_data["address"] = ""
        result = rv2(self.valid_ocr_data, 0)
        expected_response = {
            "status": "invalid",
            "http_status": 422,
            "message": self.invalid_case_message[1],
            "step": self.invalid_case_step[1],
            "extracted_data": self.valid_ocr_data
        }
        self.assertEqual(result, expected_response)


    # RV-3 function ================================================================================================
    # Pass case
    # valid date and time
    def test_rv3_valid_datetime(self):
        """Test if transaction date and time are valid"""
        times = ["15:00", "00:00", "23:59"]
        for time in times:
            with self.subTest(time=time):
                self.valid_ocr_data["transaction_time"] = time
                result = rv3(self.valid_ocr_data)
                self.assertEqual(result, True)
        
    # Not pass case
    # invalid date and time
    def test_rv3_invalid_datetime(self):
        """Test invalid transaction date and time"""
        time_interval = timedelta(days=int(self.config["RV3_TIME_DELTA"]))
        old_date = (self.yesterday_date - time_interval).strftime("%Y-%m-%d")
        dates = ["2020-01-01", old_date, self.tomorrow]
        expected_response = {
            "status": "invalid",
            "http_status": 422,
            "message": self.invalid_case_message[2],
            "step": self.invalid_case_step[2],
            "extracted_data": self.valid_ocr_data
        }
        for date in dates:
            self.valid_ocr_data["transaction_date"] = date
            with self.subTest(date=date):
                result = rv3(self.valid_ocr_data)
                self.assertEqual(result, expected_response)


    # # RV-4 function ================================================================================================
    # Pass case
    # valid hash_id
    def test_rv4_valid_hash_id(self):
        """Test if hash_id is valid"""
        result = rv4(self.valid_ocr_data)
        self.assertEqual(result, True)

    # Pass case
    # pending hash_id
    def test_rv4_pending_hash_id(self):
        """Test if hash_id is pending"""
        self.valid_ocr_data["hashed_receipt"] = "5448c610444df51badeb75f5ae4a05cf25f7631161c88fa936379491c930fdb9" # hash_id is pending in histories
        result = rv4(self.valid_ocr_data)
        self.assertEqual(result, True)
        
    # Not pass case
    # redeemed hash_id
    @patch('requests.get')
    def test_rv4_redeemed_hash_id(self, mock_get):
        """Test invalid hash_id"""
        mock_response = Mock()
        mock_response.text = json.dumps([{
            "id": "f977b2d4-626f-4ca4-b7cc-64f0031749a6",
            "receipt_hashed_id": "2094112fefa74d434adbb923c82ba24399b11a696d344331f546ea5f8f12ad10",
            "parking_id": "53c88065-6330-4c51-94a2-9113957257ff",
            "total": "500.0",
            "redeemed_at": "2025-06-18T05:17:21.299Z",
            "created_at": "2025-06-18T05:16:49.530Z",
            "content": {
                "items": [
                    {
                        "quantity": 1,
                        "description": "บัตเตอร์เฟร้นซ์",
                        "total_price": "40.0"
                    }
                ],
                "total": "40.0",
                "status": "valid",
                "tax_id": "0105527027239",
                "address": "00204: One Bangkok",
                "message": "valid",
                "remarks": [
                    "unit_no"
                ],
                "unit_no": None,
                "mall_name": "One Bangkok",
                "receipt_no": "E010030002A8742 0126153",
                "merchant_name": "Thai yamazaki Co.,Ltd.",
                "hashed_receipt": "2094112fefa74d434adbb923c82ba24399b11a696d344331f546ea5f8f12ad10",
                "transaction_date": "2025-06-11",
                "transaction_time": "18:59"
            },
            "status": "REDEEMED"
        }])
        
        mock_get.return_value = mock_response
        self.valid_ocr_data["hashed_receipt"] = "2094112fefa74d434adbb923c82ba24399b11a696d344331f546ea5f8f12ad10"
        result = rv4(self.valid_ocr_data)
        expected_response = {
            "status": "invalid",
            "http_status": 422,
            "message": self.invalid_case_message[3],
            "step": self.invalid_case_step[3],
            "extracted_data": self.valid_ocr_data
        }
        mock_get.assert_called_once()
        call_args = mock_get.call_args
        self.assertIn('params', call_args.kwargs)
        self.assertIn('receipt_hashed_id', call_args.kwargs['params'])
        self.assertEqual(result, expected_response)

    # Not pass case
    # hash_id is empty string or None #############################
    def test_rv4_invalid_hash_id_with_empty_string_or_none(self):
        """Test invalid hash_id with empty string or None"""
        invalid_hash_ids = ["", None]
        expected_response = {
            "status": "invalid",
            "http_status": 422,
            "message": self.invalid_case_message[3],
            "step": self.invalid_case_step[3],
            "extracted_data": self.valid_ocr_data
        }
        for hash_id in invalid_hash_ids:
            with self.subTest(hash_id=hash_id):
                self.valid_ocr_data["hashed_receipt"] = hash_id
                result = rv4(self.valid_ocr_data)
                self.assertEqual(result, expected_response)
    
    # # RV-5 function ================================================================================================
    # Pass case
    # valid doc_type
    def test_rv5_valid_doc_type(self):
        """Test if doc_type is valid"""
        doc_types = ["receipt", "tax invoice", "Receipt/Tax inv (ABB)"]
        for doc_type in doc_types:
            content = doc_type
            result = rv5(self.valid_ocr_data, content)
            self.assertEqual(result, True)
        
    # Not pass case
    # invalid doc_type
    def test_rv5_invalid_doc_type(self):
        """Test invalid doc_type"""
        doc_types = ["others invalid doc type", "bill check", "check"]
        expected_response = {
            "status": "invalid",
            "http_status": 422,
            "message": self.invalid_case_message[4],
            "step": self.invalid_case_step[4],
            "extracted_data": self.valid_ocr_data
        }
        for doc_type in doc_types:
            content = doc_type
            result = rv5(self.valid_ocr_data, content)
            self.assertEqual(result, expected_response)

    # Not pass case
    # invalid doc_type with empty string or None ###################################
    def test_rv5_invalid_doc_type_with_empty_or_none(self):
        """Test invalid doc_type with empty string or None"""
        invalid_doc_types = ["", None]
        expected_response = {
            "status": "invalid",
            "http_status": 422,
            "message": self.invalid_case_message[4],
            "step": self.invalid_case_step[4],
            "extracted_data": self.valid_ocr_data
        }
        for doc_type in invalid_doc_types:
            with self.subTest(doc_type=doc_type):
                content = doc_type
                result = rv5(self.valid_ocr_data, content)
                self.assertEqual(result, expected_response)


if __name__ == "__main__":
    unittest.main()