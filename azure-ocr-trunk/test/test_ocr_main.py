import unittest
from unittest.mock import patch
from src.service.ocr_main import main


class TestOCRMain(unittest.TestCase):
    """Test OCR main function"""

    def setUp(self):
        """Set up test data."""
        self.mock_extracted_data = {
            "merchant_name": "Thai yamazaki Co.,Ltd.",
            "transaction_date": "2025-01-30",
            "transaction_time": "18:59",
            "items": [
                {
                    "description": "บัตเตอร์เฟร้นซ์",
                    "quantity": 1,
                    "total_price": 40.0
                },
                {
                    "description": "เรซิ่นบอล (1 ชิ้น)",
                    "quantity": 1,
                    "total_price": 25.0
                },
                {
                    "description": "ช็อกโกแลตเมสซี่",
                    "quantity": 1,
                    "total_price": 40.0
                },
                {
                    "description": "ซีบราครัวซองค",
                    "quantity": 1,
                    "total_price": 18.0
                },
                {
                    "description": "พายไก่",
                    "quantity": 1,
                    "total_price": 34.0
                }
            ],
            "total": 157.0,
            "tax_id": "0105527027239",
            "receipt_no": "E010030002A8742 0126153",
            "address": "00204: One Bangkok",
            "unit_no": None,
            "mall_name": "One Bangkok",
            "hashed_receipt": "c9a7b49f799afe278160b5b1b4f6731a00d0c4ae1d63e1566af9cc95036ae94e",
        }
        self.content = "TAX INVOICE(ABB)/RECEIPT"
        # Add a URL fot testing ============================================
        self.image_url = "https://i.ibb.co/sJXvKKFV/Yamazaki-T-Off-01.jpg"
        # ==================================================================

    @patch('src.core.ocr_intel.extract_receipts')
    def test_successful_extraction(self, mock_extract_receipts):
        """Test successful extraction of receipt data."""
        mock_extract_receipts.return_value = self.mock_extracted_data

        result = main(self.image_url)

        self.assertIsInstance(result, dict)
        self.assertIn("remarks", result)
        self.assertIn("status", result)
        self.assertIn("message", result)
        for key in self.mock_extracted_data.keys(): # loop through each key in mock_extracted_data
            self.assertIn(key, result)
            if key == "total":
                self.assertIsInstance(result[key], str)

        for item_list in result['items']: # loop through list of items
            # print(f"List element: {item_list}")
            for item_key in item_list.keys(): # loop through each item in the item dict
                # print(f"  item key: {item_key}")
                if item_key == "total_price" and item_list[item_key] is not None:
                    # print(f"    Str : {item_list[item_key]} type {type(item_list[item_key])}")
                    self.assertIsInstance(item_list[item_key], str)

if __name__ == "__main__":
    unittest.main()