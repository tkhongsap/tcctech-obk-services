from locust import HttpUser, task, between
from urllib.parse import quote

class ReceiptOCRUser(HttpUser):
    wait_time = between(1, 2)

    @task
    def call_receipt_ocr(self):
        raw_url = "https://thumbs.dreamstime.com/b/illustration-receipt-template-black-white-vector-129915676.jpg"
        encoded_url = quote(raw_url, safe='')
        self.client.get(f"/receipt-ocr-gpt-4.1?source={raw_url}")
