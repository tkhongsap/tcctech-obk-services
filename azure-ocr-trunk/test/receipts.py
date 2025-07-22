# Comment บนแต่ละเคสคือรายละเอียดเทสเคส
# Comment หลัง url คือชื่อ receipt ที่ใช้ทดสอบ
receipts = {
    # Verify successful extraction when all mandatory fields are present and clearly readable.
    "TC_OCV-1_001": "https://i.ibb.co/BFjg7rP/Rise-Coffee-T-Off-03.jpg", # Rise Coffee_T-Off_03 "2025-01-23"
    # Verify TaxID is missing or unreadable by OCR. , but Merchant Name data is still
    "TC_OCV-1_002": "https://i.ibb.co/nqMzbwJs/One-to-Two-T-Off-01.jpg", # One to Two_T-Off_01 "2025-01-21"
    # Verify Merchant Name is missing or unreadable by OCR. , but TexID data is still
    "TC_OCV-1_003": "https://i.ibb.co/S1TBYZb/DQ-Potch-05-Merchant-Name.jpg", # DQ_Potch_05 (ลบ Merchant Name) "2025-01-23"
    # Verify TaxID and Merchant Name is missing or unreadable by OCR.
    "TC_OCV-1_004": "https://i.ibb.co/YBHmP99T/Screenshot-2025-07-02-132307.png", # Yakiniku Like_T-Off_01[ลบ TexID&Merchant] "2025-01-23"
    # Verify Transaction Date and Time are missing or unreadable by OCR.
    "TC_OCV-1_005": "https://i.ibb.co/QF4QKP2H/Sizzler-Kanchaya-Date.jpg", # Sizzler_Kanchaya [Date ไม่มี] 
    # Verify Total Amount is missing or unreadable by OCR.
    "TC_OCV-1_006": "https://i.ibb.co/0VmhnPtb/One-to-Two-T-Off-01.jpg", # GAGA_Potch_04[ลบ total] "2025-01-23"
    # Verify Receipt No. is missing or unreadable by OCR, but pass OCV1 validation.
    "TC_OCV-1_007": "https://i.ibb.co/xKDf2mTw/Anri-Potch-01-ID.jpg", # Anri_Potch_01[ลบ ID] "2025-01-23" 

    # Verify TaxID from receipt matches an entry in the store whitelist.
    "TC_RV-1_001": "https://i.ibb.co/BFjg7rP/Rise-Coffee-T-Off-03.jpg", # Rise Coffee_T-Off_03 "2025-01-23"
    # Verify Merchant Name matches whitelist and TaxID does not match or is absent.
    "TC_RV-1_002": "https://i.ibb.co/tT1Trjpk/MANAA-T-Off-05-Tex-ID.jpg", # MANAA_T-Off_05 [TexID ไม่ตรง] "2025-01-21"
    # Verify TaxID matches whitelist and  Merchant Name does not match or is absent.
    "TC_RV-1_003": "https://i.ibb.co/LdVr45tn/KAGETSU-ARASHI.jpg", # KAGETSU ARASHI "2025-05-20"
    # Verify rejection when Tax ID, Merchant Name do not match any whitelisted entry.
    "TC_RV-1_004": "https://i.ibb.co/xStFC4nW/Yakiniku-Like-T-Off-01-Tex-ID-Merchant.jpg", # Yakiniku Like_T-Off_01[ลบ TexID&Merchant] "2025-01-23"

    # Verify location validity when Mall Name from receipt match whitelist.
    "TC_RV-2_001": "https://i.ibb.co/BFjg7rP/Rise-Coffee-T-Off-03.jpg", # Rise Coffee_T-Off_03 "2025-01-23"
    # Verify location validity when Address from receipt match whitelist.
    "TC_RV-2_002": "https://i.ibb.co/ksfsf4C6/KANEKO-HANNOSUKE-Denpong-mall-name.png", # KANEKO HANNOSUKE_Denpong [mall name ไม่ตรง] "2025-02-18"
    # Verify location validity when CMS Flag from match whitelist.
    "TC_RV-2_003": "https://i.ibb.co/zYcnxRd/Veggie-Cafe-T-Off-04-Mall-Name-Addres.jpg", # Veggie Cafe_T-Off_04 [Mall Name, Addres ไม่ตรง] "2025-01-30"
    # Verify rejection when Mall Name, Address, and CMS Flag do not indicate location no matching whitelist.
    "TC_RV-2_004": "https://i.ibb.co/0yRZ9GjW/Thank-you-Cup-1-Kitti-B-Mall-Name-Address.jpg", # Thank you Cup_1 - Kitti B. [Mall Name , Address ไม่ตรง] "2025-01-16"

    # Verify eligibility when Transaction Date matches Submission Date (same calendar day).
    "TC_RV-3_001": "https://i.ibb.co/BFjg7rP/Rise-Coffee-T-Off-03.jpg", # Rise Coffee_T-Off_03 "2025-01-23"
    # Verify rejection when Transaction Date is later than the Submission Date 
    "TC_RV-3_002": "https://i.ibb.co/nMmGj91s/Screenshot-2025-07-07-164346.png", # Rise Coffee_T-Off_03 "2020-06-23" "แก้วันที่ในใบเสร็จให้เป็นอดีต แล้วปรับ config RV3_TIME_DELTA ให้ครอบคลุมไม่ถึง"
    # Verify rejection when Transaction Date is earlier than the Submission Date
    "TC_RV-3_003": "https://i.ibb.co/Ld4CDns3/Screenshot-2025-07-07-164559.png", # Rise Coffee_T-Off_03 "2070-06-23" "แก้วันที่ในใบเสร็จให้เป็นอนาคต"

    # Verify when the generated Hash ID is unique
    "TC_RV-4_001": "https://i.ibb.co/BFjg7rP/Rise-Coffee-T-Off-03.jpg", # Rise Coffee_T-Off_03 "2025-01-23"
    # Verify rejection when the generated Hash ID matches an existing record in the system.
    "TC_RV-4_002": "https://i.ibb.co/nqMzbwJs/One-to-Two-T-Off-01.jpg", # One to Two_T-Off_01 "2025-01-21" # Test duplicated

    # Verify when detected header terms are  ("Receipt", "Tax Invoice", "Receipt/Tax inv (ABB)").
    "TC_RV-5_001": "https://i.ibb.co/sJXvKKFV/Yamazaki-T-Off-01.jpg", #Yamazaki_T-Off_01 "2025-01-30"
    # Verify rejection when standard header terms are not detected or reliable indicators are absent.
    "TC_RV-5_002": "https://i.ibb.co/XZSr5hgw/Sushiro-Kanchaya-INVOICE.jpg", # Sushiro_Kanchaya [ไม่มี INVOICE] "2025-03-13"
}

# Test case type show which case is positive or negative
# "pos" means the test case should pass, and "neg" means the test case should fail.
test_case_type = {
    # OCV1
    "TC_OCV-1_001": "pos",
    "TC_OCV-1_002": "pos",
    "TC_OCV-1_003": "pos",
    "TC_OCV-1_004": "neg",
    "TC_OCV-1_005": "neg",
    "TC_OCV-1_006": "neg",
    "TC_OCV-1_007": "pos", # แต่ก่อนมันคาดหวังว่าไม่ผ่าน (negative case) แต่ตอนนี้เอา receipt_no ออกไปจาก logic ocv1 แล้ว (7/7/2025)

    # RV1
    "TC_RV-1_001": "pos",
    "TC_RV-1_002": "pos",
    "TC_RV-1_003": "pos",
    "TC_RV-1_004": "neg",

    # RV2
    "TC_RV-2_001": "pos",
    "TC_RV-2_002": "pos",
    "TC_RV-2_003": "pos",
    "TC_RV-2_004": "neg",

    # RV3
    "TC_RV-3_001": "pos",
    "TC_RV-3_002": "neg",
    "TC_RV-3_003": "neg",

    # RV4
    "TC_RV-4_001": "pos",
    "TC_RV-4_002": "neg",

    # RV5
    "TC_RV-5_001": "pos",
    "TC_RV-5_002": "neg",
}
