from src.service.ocr_main import main as ocr_main
import pprint
from test.receipts import receipts, test_case_type
import re
from typing import Dict
from fastapi import HTTPException

steps = ["ocv1", "rv1", "rv2", "rv3", "rv4", "rv5"]

def extract_step_from_test_case_id(test_case_id):
    pattern = r'TC_([A-Z]+)-(\d+)_\d+'
    
    match = re.search(pattern, test_case_id)
    if match:
        # Convert to lowercase and remove hyphen
        prefix = match.group(1).lower()
        number = match.group(2)
        return f"{prefix}{number}"
    else:
        return None
    
def check_test_cases_result(test_case: str, content:str, step: str):
    """
    เช็คว่าแต่ละเคสผ่านตาม QA test cases หรือไม่
    ผ่าน หมายความว่าเคสที่เป็น positive case จะต้องมี status เป็น valid หรือ failed ใน step หลังจาก step ที่เทส
    เช่น ถ้า step ที่เทสคือ ocv1 เคสที่เป็น positive case จะต้องมี status เป็น valid หรือ failed ใน step rv1, rv2, rv3, rv4, rv5 ถือว่าผ่านเทสเคส
    เคสที่เป็น negative case จะต้องมี status เป็น invalid และ step ต้องตรงกับ step ที่เทส

    ถ้าไม่ตรงตามเงื่อนไขนี้ถือว่าไม่ผ่านเทสเคส
    """
    if content:
        if test_case_type[test_case] == "pos":
            if content.get("status") == "valid":
                print(f"✅ Test case {test_case} passed")
            elif content.get("status") == "invalid" and content.get("step") in steps[steps.index(step)+1:]:
                print(f"✅ Test case {test_case} passed")
            else:
                print(f"❌ Test case {test_case} failed")
                return test_case

        elif test_case_type[test_case] == "neg":
            if content.get("status") == "valid":
                print(f"❌ Test case {test_case} failed")
                return test_case
            elif content.get("status") == "invalid" and content.get("step") == steps[steps.index(step)]:
                print(f"✅ Test case {test_case} passed")
            else:
                print(f"❌ Test case {test_case} failed")
                return test_case
    else:
        # content เป็น None ในกรณีที่ลิ้งรูปภาพมีปัญหา ให้ลองรันเทสใหม่ หรือเปลี่ยนลิ้งรูปภาพ
        print(f"❌ Test case {test_case} failed due to no content, Please check an image URL if it does exist or not")
        return test_case + " due to no content"
    
def test_main(receipts: Dict):
    failed_cases = []
    for test_case_id, receipt_url in receipts.items():
        print(f"Processing test case: {test_case_id}")
        try:
            result = ocr_main(source=receipt_url)
            failed_case = check_test_cases_result(test_case=test_case_id, content=result, step=extract_step_from_test_case_id(test_case_id))
            failed_cases.append(failed_case) if failed_case else None
            pprint.pprint(result)
            print("====================================")
        except HTTPException as e:
            failed_case = check_test_cases_result(test_case=test_case_id, content=e.detail, step=extract_step_from_test_case_id(test_case_id))
            failed_cases.append(failed_case) if failed_case else None
            pprint.pprint(e.detail)
            print("====================================")
        except Exception as e:
            print(f"❌ An unexpected error occurred: {str(e)}")
            print("====================================")
    if failed_cases:
        print("❌❌❌ The following test cases failed ❌❌❌:")
        for case in failed_cases:
            print(case)

if __name__ == "__main__":
    test_main(receipts=receipts)

    
