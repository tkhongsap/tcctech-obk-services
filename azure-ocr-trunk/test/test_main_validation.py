import unittest
from unittest.mock import patch
from datetime import datetime, timedelta
from fastapi import HTTPException
from src.core.validation import main_validation, make_response

class TestMainValidation(unittest.TestCase):
    """Test the main_validation function"""

    def setUp(self):
        """Set up test data."""
        self._now = datetime.now()
        self.today = self._now.strftime("%Y-%m-%d")
        self.yesterday = (self._now - timedelta(days=1)).strftime("%Y-%m-%d")
        self.tomorrow = (self._now + timedelta(days=1)).strftime("%Y-%m-%d")
        self.content = "receipt"
        self.valid_ocr_data = {
            "merchant_name": "Yamazaki", 
            "transaction_date": self.today, 
            "transaction_time": "14:04", 
            "items": [
                {"description": "Iced Americano - Floral", "quantity": 1, "total_price": "55.0"}
            ],
            "total": "55.0", 
            "tax_id": "0105527027239", 
            "receipt_no": "10344001022500156", 
            "address": "lumpini", 
            "unit_no": None, 
            "mall_name": "One Bangkok",
            "hashed_receipt": "54241a863f9bdf7760556e4b68c49659bfacf4c7715513125451c45d6297b59d", 
        }
        self.content = "receipt"

    # ==========================================================================================================================
    #                                                   Pass cases
    # ==========================================================================================================================

    # Pass case
    # valid with dict input
    def test_valid_receipt_with_dict(self):
        """Test when all required fields including tax_id are present."""
        result = main_validation(self.valid_ocr_data, self.content)
        self.assertEqual(result["status"], "valid")
        self.assertEqual(result["message"], "valid")

    # Pass case
    # Pass every validation steps
    @patch('src.core.validation.rv5')
    @patch('src.core.validation.rv4')
    @patch('src.core.validation.rv3')
    @patch('src.core.validation.rv2')
    @patch('src.core.validation.rv1')
    @patch('src.core.validation.ocv1')
    def test_main_validation_success(self, mock_ocv1, mock_rv1, mock_rv2, mock_rv3, mock_rv4, mock_rv5):
        """Test successful validation flow."""
        # Mock all validation functions to return True
        mock_ocv1.return_value = True
        mock_rv1.return_value = (True, 0)
        mock_rv2.return_value = True
        mock_rv3.return_value = True
        mock_rv4.return_value = True
        mock_rv5.return_value = True
        
        result = main_validation(self.valid_ocr_data.copy(), self.content)
        # Check that all validation functions were called
        mock_ocv1.assert_called_once()
        mock_rv1.assert_called_once()
        mock_rv2.assert_called_once()
        mock_rv3.assert_called_once()
        mock_rv4.assert_called_once()
        mock_rv5.assert_called_once()
        
        # Check result structure
        self.assertEqual(result['status'], 'valid')
        self.assertEqual(result['message'], 'valid')
        self.assertIsInstance(result['total'], str)
        self.assertIsInstance(result['items'][0]['total_price'], str)

    # Pass case
    # Check data transformation's validity
    @patch('src.core.validation.rv5')
    @patch('src.core.validation.rv4')
    @patch('src.core.validation.rv3')
    @patch('src.core.validation.rv2')
    @patch('src.core.validation.rv1')
    @patch('src.core.validation.ocv1')
    def test_main_validation_data_transformation(self, mock_ocv1, mock_rv1, mock_rv2, mock_rv3, mock_rv4, mock_rv5):
        """Test that data is properly transformed in successful validation."""
        # Mock all validation functions to return True
        mock_ocv1.return_value = True
        mock_rv1.return_value = (True, 5)
        mock_rv2.return_value = True
        mock_rv3.return_value = True
        mock_rv4.return_value = True
        mock_rv5.return_value = True
        
        # Test with multiple items and different numeric values
        test_receipt = self.valid_ocr_data.copy()
        test_receipt['total'] = "150.75"
        test_receipt['items'] = [
            {"description": "Item 1", "quantity": 2, "total_price": "100.25"},
            {"description": "Item 2", "quantity": 1, "total_price": "50.50"}
        ]
        
        result = main_validation(test_receipt, self.content)
        
        # Check data transformation
        self.assertEqual(result['status'], 'valid')
        self.assertEqual(result['message'], 'valid')
        self.assertIsInstance(result['total'], str)
        self.assertIsInstance(result['items'][0]['total_price'], str)
        self.assertIsInstance(result['items'][1]['total_price'], str)


    # ==========================================================================================================================
    #                                                   Fail cases
    # ==========================================================================================================================


    # Fail case
    # Invalid input format
    def test_main_validation_invalid_input_format(self):
        """Test validation with invalid input format (non-dict)."""
        invalid_inputs = [
            "Invalid data",
            123,
            [],
            None,
            True
        ]
        
        for invalid_input in invalid_inputs:
            with self.assertRaises(HTTPException) as context:
                main_validation(invalid_input, self.content)
            
            self.assertEqual(context.exception.status_code, 400)
            self.assertIn("Invalid input format", str(context.exception.detail))

    # Fail case
    # OCV1 fails
    @patch('src.core.validation.ocv1')
    def test_main_validation_ocv1_failure(self, mock_ocv1):
        """Test validation failure at ocv1 step."""
        error_response = make_response("invalid", 422, "Could not read required information from receipt.", step="ocv1", extracted_data=self.valid_ocr_data)
        mock_ocv1.return_value = error_response
        
        with self.assertRaises(HTTPException) as context:
            main_validation(self.valid_ocr_data, self.content)
        
        self.assertEqual(context.exception.status_code, 422)
        self.assertEqual(context.exception.detail["extracted_data"], self.valid_ocr_data)
        mock_ocv1.assert_called_once()

    # Fail case
    # RV1 fails
    @patch('src.core.validation.rv1')
    @patch('src.core.validation.ocv1')
    def test_main_validation_rv1_failure(self, mock_ocv1, mock_rv1):
        """Test validation failure at rv1 step."""
        mock_ocv1.return_value = True
        error_response = make_response("invalid", 422, "Receipt is not from a participating store.", step="rv1", extracted_data=self.valid_ocr_data)
        mock_rv1.return_value = (error_response, 'invalid')
        
        with self.assertRaises(HTTPException) as context:
            main_validation(self.valid_ocr_data, self.content)
        
        self.assertEqual(context.exception.status_code, 422)
        self.assertEqual(context.exception.detail["extracted_data"], self.valid_ocr_data)
        mock_rv1.assert_called_once()

    # Fail case
    # RV2 fails
    @patch('src.core.validation.rv2')
    @patch('src.core.validation.rv1')
    @patch('src.core.validation.ocv1')
    def test_main_validation_rv2_failure(self, mock_ocv1, mock_rv1, mock_rv2):
        """Test validation failure at rv2 step."""
        mock_ocv1.return_value = True
        mock_rv1.return_value = (True, 0)
        error_response = make_response("invalid", 422, "Receipt location not recognized as One Bangkok.", step="rv2", extracted_data=self.valid_ocr_data)
        mock_rv2.return_value = error_response
        
        with self.assertRaises(HTTPException) as context:
            main_validation(self.valid_ocr_data, self.content)
        
        self.assertEqual(context.exception.status_code, 422)
        self.assertEqual(context.exception.detail["extracted_data"], self.valid_ocr_data)
        mock_rv2.assert_called_once_with(self.valid_ocr_data, 0)

    # Fail case
    # RV3 fails
    @patch('src.core.validation.rv3')
    @patch('src.core.validation.rv2')
    @patch('src.core.validation.rv1')
    @patch('src.core.validation.ocv1')
    def test_main_validation_rv3_failure(self, mock_ocv1, mock_rv1, mock_rv2, mock_rv3):
        """Test validation failure at rv3 step."""
        mock_ocv1.return_value = True
        mock_rv1.return_value = (True, 0)
        mock_rv2.return_value = True
        error_response = make_response("invalid", 422, "Receipt is too old to redeem.", step="rv3", extracted_data=self.valid_ocr_data)
        mock_rv3.return_value = error_response
        
        with self.assertRaises(HTTPException) as context:
            main_validation(self.valid_ocr_data, self.content)
        
        self.assertEqual(context.exception.status_code, 422)
        self.assertEqual(context.exception.detail["extracted_data"], self.valid_ocr_data)
        mock_rv3.assert_called_once()

    # Fail case
    # RV4 fails
    @patch('src.core.validation.rv4')
    @patch('src.core.validation.rv3')
    @patch('src.core.validation.rv2')
    @patch('src.core.validation.rv1')
    @patch('src.core.validation.ocv1')
    def test_main_validation_rv4_failure(self, mock_ocv1, mock_rv1, mock_rv2, mock_rv3, mock_rv4):
        """Test validation failure at rv4 step."""
        mock_ocv1.return_value = True
        mock_rv1.return_value = (True, 0)
        mock_rv2.return_value = True
        mock_rv3.return_value = True
        error_response = make_response("invalid", 422, "This receipt has already been redeemed.", step="rv4", extracted_data=self.valid_ocr_data)
        mock_rv4.return_value = error_response
        
        with self.assertRaises(HTTPException) as context:
            main_validation(self.valid_ocr_data, self.content)
        
        self.assertEqual(context.exception.status_code, 422)
        self.assertEqual(context.exception.detail["extracted_data"], self.valid_ocr_data)
        mock_rv4.assert_called_once()

    # Fail case
    # RV5 fails
    @patch('src.core.validation.rv5')
    @patch('src.core.validation.rv4')
    @patch('src.core.validation.rv3')
    @patch('src.core.validation.rv2')
    @patch('src.core.validation.rv1')
    @patch('src.core.validation.ocv1')
    def test_main_validation_rv5_failure(self, mock_ocv1, mock_rv1, mock_rv2, mock_rv3, mock_rv4, mock_rv5):
        """Test validation failure at rv5 step."""
        mock_ocv1.return_value = True
        mock_rv1.return_value = (True, 0)
        mock_rv2.return_value = True
        mock_rv3.return_value = True
        mock_rv4.return_value = True
        error_response = make_response("invalid", 422, "Invalid document type for redemption.", step="rv5", extracted_data=self.valid_ocr_data)
        mock_rv5.return_value = error_response
        
        with self.assertRaises(HTTPException) as context:
            main_validation(self.valid_ocr_data, self.content)
        
        self.assertEqual(context.exception.status_code, 422)
        self.assertEqual(context.exception.detail["extracted_data"], self.valid_ocr_data)
        mock_rv5.assert_called_once_with(self.valid_ocr_data, self.content)



if __name__ == "__main__":
    unittest.main()