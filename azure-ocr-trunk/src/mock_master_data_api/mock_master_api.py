from fastapi import FastAPI, Response
from fastapi.responses import JSONResponse
from typing import Any, Dict
import json

from white_list import whitelist

app = FastAPI()


property_name = [
    {
        "id": "793e5ba2-ef8d-4a75-9812-ff4923fefd2a",
        "name": "one bangkok",
        "addresses": ["rama 4", "rama4", "lumpini", "ลุมพินี", "พระราม4"],
        "keywords": ["obk", "one bangkok", "onebangkok", "วันแบงคอก"],
    },
    {
        "id": "5c5eae36-81c6-47e4-a457-32fa4f727a95",
        "name": "the parq",
        "addresses": [],
        "keywords": [],
    },
    {
        "id": "4acc02ff-ade0-495c-953f-0a436021d2ee",
        "name": "other",
        "addresses": ["123456789 aaaa"],
        "keywords": ["aaa bbb cccc"],
    },
]

history = [
    {
        "id": "43e4b537-42b0-4dc5-a04f-a473101cd893",
        "receipt_hashed_id": "362dc651b1166e5f61bb028785bd0bda2515401849ea0c91484bd5f6b15e8455",
        "user_id": "000072c5-d5c1-4055-8ba1-ac2a3d8691e0",
        "status": "REDEEMED",
        "content": '{"merchant_name":"Brewing Happiness Co.,Ltd.","transaction_date":"2025-02-04","transaction_time":"14:04","items":[{"description":"Iced Americano - Floral","quantity":1,"total_price":55},{"description":"Iced Cappuccino - Floral","quantity":1,"total_price":55}],"total":55,"tax_id":105560101035,"receipt_no":"10344001022500156","address":"1877 One Bangkok Parade Building 1520 RoomRama4 Rd. Lumpini Pathumwan Bangkok 10330","unit_no":1520,"mall_name":"One Bangkok","hashed_receipt":"e6c8d18f08a8632c8c313218d0d6270d57a117215dc6d7a1eab4b313af16da36","status":"valid","message":"valid"}',
        "redeemed_at": "2025-05-05T10:40:51.620Z",
        "created_at": "2025-05-05T08:40:51.620Z",
    },
    {
        "id": "72533dd4-cc20-4fa3-ad8c-a609958a0aa7",
        "status": "PENDING",
        "created_at": "2025-05-05T08:40:51.620Z",
    },
    {
        "id": "43e4b537-42b0-4dc5-a04f-a473101cd894",
        "receipt_hashed_id": "e6a23b064d72b99fc5d4e2b5268ebb2b7fe0121b11644ce4ad32b928e520824c",
        "user_id": "000072c5-d5c1-4055-8ba1-ac2a3d8691e0",
        "status": "REDEEMED",
        "content": "{'merchant_name': 'พี ไอ บี/เค แอล คอลซัลติ้ง (ไทยแลนด์) จำกัด', 'transaction_date': '2025-01-31', 'transaction_time': '12:39', 'items': [{'description': 'Burnt Caramel Latte', 'quantity': 1, 'total_price': 160.0}, {'description': 'Black Sesame Latte', 'quantity': 2, 'total_price': 320.0}, {'description': 'Honey Lemon', 'quantity': 1, 'total_price': 140.0}], 'total': 620.0, 'tax_id': '0105546032501', 'receipt_no': '020EQ', 'address': 'อาคารพาเหรด โครงการ วันแบงค็อก ห้องเลข\nที่ OP1303 ชั้น3 เลขที่1877 ถนน พระรามที่ 4\nแขวงลุมพินี เขต ปทุมวัน กรุงเทพมหานคร\n10330', 'unit_no': None, 'mall_name': 'One Bangkok', 'hashed_receipt': 'e6a23b064d72b99fc5d4e2b5268ebb2b7fe0121b11644ce4ad32b928e520824c'}",
        "redeemed_at": "2025-05-05T10:40:51.620Z",
        "created_at": "2025-05-05T08:40:51.620Z",
    },
    {
        "id": "43e4b537-42b0-4dc5-a04f-a473101cd895",
        "receipt_hashed_id": "5448c610444df51badeb75f5ae4a05cf25f7631161c88fa936379491c930fdb9",
        "user_id": "000072c5-d5c1-4055-8ba1-ac2a3d8691e0",
        "status": "PENDING",
        "content": "{'merchant_name': 'MaNaa', 'transaction_date': '2025-01-21', 'transaction_time': '16:51', 'items': [{'description': 'Chocolate Old Fashion', 'quantity': 1, 'total_price': 60.0}, {'description': 'Sugar Cinnamon Donut', 'quantity': 1, 'total_price': 35.0}], 'total': 95.0, 'tax_id': '0105524028391', 'receipt_no': 'E020180002A2690 MN1BK67/00001398', 'address': 'ชั้น B1, ถนน วิทยุ เขตลุมพินี แขวง\nมักกะสัน กรุงเทพ', 'unit_no': None, 'mall_name': 'One Bangkok', 'hashed_receipt': '5448c610444df51badeb75f5ae4a05cf25f7631161c88fa936379491c930fdb9'}",
        "redeemed_at": "2025-05-05T10:40:51.620Z",
        "created_at": "2025-05-05T08:40:51.620Z",
    },
    {
        "id": "72533dd4-cc20-4fa3-ad8c-a609958a0aa8",
        "receipt_hashed_id": "bbff090807607bc4a2c34488411a85c3fc331917c9567d9e9bac0dd0f6e3c322",
        "user_id": "000072c5-d5c1-4055-8ba1-ac2a3d8691e2",
        "status": "PENDING",
        "content": "{'merchant_name': 'RISE COFFEE', 'transaction_date': '2025-01-23', 'transaction_time': '18:39', 'items': [{'description': 'ETHIOPIA HAMASHO\n(150g)', 'quantity': 1, 'total_price': 650.0}], 'total': 650.0, 'tax_id': '0105663069396', 'receipt_no': 'E010030002A8774 RC2025/00002848', 'address': 'เลขที่ 199 อาคารเดอะสตอรี่ส์ ห้องเลขที่\n2B120-2B121 ชั้น B1 ถ.วิทยุ แขวงลุมพินี เขต\nปทุมวัน กรุงเทพมหานคร 10330', 'unit_no': '2B120-2B121 ชั้น B1 ถ.วิทยุ แขวงลุมพินี เขต', 'mall_name': 'One Bangkok', 'hashed_receipt': 'bbff090807607bc4a2c34488411a85c3fc331917c9567d9e9bac0dd0f6e3c322','status':'valid','message':'valid'}",
        "redeemed_at": None,
        "created_at": "2025-05-05T08:40:51.620Z",
    },
    {
        "id": "72533dd4-cc20-4fa3-ad8c-a609958a0aa9",
        "receipt_hashed_id": "3e6717193c7599f5c868e8e8a1ef02461e7828c10b1e4054c6c7c9037d943623",
        "user_id": "000072c5-d5c1-4055-8ba1-ac2a3d8691e2",
        "status": "REDEEMED",
        "content": '{"merchant_name": "ONE TO TWO","transaction_date": "2025-01-21","transaction_time": "18:38","items": [{"description": "COCOA - ICED","quantity": 1,"total_price": "65.00"}],"total": "65.00","tax_id": "Invalid","receipt_no": "35","address": "1-2 One Bangkok ห้องเลข114 ชั้น11 โครงการ วัน แบงค็อก ถนนวิทยุ แขวงช่องนนทรี เขตยานนาวา กรุงเทพมหานาคร 10330","unit_no": "114","mall_name": "One Bangkok","raw_data": "Q035 ใบเสร็จรับเงิน ONE TO TWO COFFEE COMPANY 1-2 One Bangkok ห้องเลข114 ชั้น11 โครงการ วัน แบงค็อก ถนนวิทยุ แขวงช่องนนทรี เขตยานนาวา กรุงเทพมหานาคร 10330 Tel : 083 2748841 14 Atom 21 ม.ค. 25 18:38 T1 : Gst 0 1 COCOA - ICED 65.00 +หวานน้อยมาก Sub Total .00 Amt Before VAT 7% 60.75 VAT 7% 4.25 Total 65.00 Payment Bill No. : 35 1. QR Banking : KBANK 65.00 TYPE : KBANK DESC : Time/Desc NAME : CusName ใบกำกับภาษีมีในรูปแบบสามารถออกให้ภายในวัน และสถานที่ลูกค้าสั่งสินค้าเท่านั้น THANK YOU / ขอบคุณค่ะ 1:2 Coffee Company @onetwocoffee","hashed_receipt": "3e6717193c7599f5c868e8e8a1ef02461e7828c10b1e4054c6c7c9037d943623"}',
        "redeemed_at": "2025-05-05T08:40:51.620Z",
        "created_at": "2025-05-05T08:40:51.620Z",
    },
    {
        "id": "72533dd4-cc20-4fa3-ad8c-a609958a0ab1",
        "receipt_hashed_id": "dd4a4dd04ac152516cea5dbcb4584760043519f8ed0453bce454acfbd7b0f5cb",
        "user_id": "000072c5-d5c1-4055-8ba1-ac2a3d8691e2",
        "status": "REDEEMED",
        "content": '{"merchant_name": "ONE TO TWO","transaction_date": "2025-01-21","transaction_time": "18:38","items": [{"description": "COCOA - ICED","quantity": 1,"total_price": "65.00"}],"total": "65.00","tax_id": "Invalid","receipt_no": "35","address": "1-2 One Bangkok ห้องเลข114 ชั้น11 โครงการ วัน แบงค็อก ถนนวิทยุ แขวงช่องนนทรี เขตยานนาวา กรุงเทพมหานาคร 10330","unit_no": "114","mall_name": "One Bangkok","raw_data": "Q035 ใบเสร็จรับเงิน ONE TO TWO COFFEE COMPANY 1-2 One Bangkok ห้องเลข114 ชั้น11 โครงการ วัน แบงค็อก ถนนวิทยุ แขวงช่องนนทรี เขตยานนาวา กรุงเทพมหานาคร 10330 Tel : 083 2748841 14 Atom 21 ม.ค. 25 18:38 T1 : Gst 0 1 COCOA - ICED 65.00 +หวานน้อยมาก Sub Total .00 Amt Before VAT 7% 60.75 VAT 7% 4.25 Total 65.00 Payment Bill No. : 35 1. QR Banking : KBANK 65.00 TYPE : KBANK DESC : Time/Desc NAME : CusName ใบกำกับภาษีมีในรูปแบบสามารถออกให้ภายในวัน และสถานที่ลูกค้าสั่งสินค้าเท่านั้น THANK YOU / ขอบคุณค่ะ 1:2 Coffee Company @onetwocoffee","hashed_receipt": "dd4a4dd04ac152516cea5dbcb4584760043519f8ed0453bce454acfbd7b0f5cb"}',
        "redeemed_at": "2025-05-05T08:40:51.620Z",
        "created_at": "2025-05-05T08:40:51.620Z",
    },
    {
        "id": "60a9e3c1-8698-430e-af7c-23517652fde9",
        "receipt_hashed_id": None,
        "user_id": None,
        "status": "DECLINED",
        "content": {
            "merchant_name": "DQ CASHIER",
            "transaction_date": "2025-01-23",
            "transaction_time": "18:24",
            "items": [
                {
                    "description": "BZ TOFFEE CAKE S",
                    "quantity": None,
                    "total_price": "49",
                }
            ],
            "total": "49",
            "tax_id": "0105525046201",
            "receipt_no": "37438",
            "address": None,
            "unit_no": None,
            "mall_name": None,
            "hashed_receipt": "2a3495efb57eef7997f1961874f0ddf9de801b22cec3e0754cfb2cb9e04ae509",
        },
        "redeemed_at": None,
        "created_at": "2025-05-05T08:40:51.620Z",
        "total": "49",
        "parking_id": "110072c5-d5c1-4055-8ba1-ac2a3d86sjdg",
    },
]

doc_type = [
    {
        "id": "7272192b-036e-4764-8fbf-12cdc5118fdb",
        "keyword": "receipt",
        "type": "receipt",
    },
    {
        "id": "b7fcda5e-4550-402a-a435-a2e57a8def0a",
        "keyword": "bill check",
        "type": "non-receipt",
    },
    {
        "id": "c5615f69-5722-46c1-b3bf-fd70dad92070",
        "keyword": "Tax invoice",
        "type": "receipt",
    },
    {
        "id": "c5615f69-5722-46c1-b3bf-fd70dad92071",
        "keyword": "Receipt/Tax inv (ABB)",
        "type": "receipt",
    },
    {
        "id": "e9694def-258c-4432-8421-c3a7a0bee2ac",
        "keyword": "check",
        "type": "non-receipt",
    },
]


class PureJSONResponse(JSONResponse):
    """Custom response class that returns only the content without any wrapper"""

    def render(self, content: Any) -> bytes:
        # This bypasses FastAPI's default rendering and just returns the raw content
        return super().render(content)


@app.get("/config/store/whitelist", response_class=PureJSONResponse)
def read_root():
    return whitelist


@app.get("/config/property/name", response_class=PureJSONResponse)
def read_root():
    return property_name


@app.get("/config/doc", response_class=PureJSONResponse)
def read_root():
    return doc_type


@app.get("/receipt/all", response_class=PureJSONResponse)
def read_root():
    return history


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
