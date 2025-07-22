import { BaseHttpClient } from './base_client';
import https from 'https';
import { AxiosResponse } from 'axios';

interface ReceiptItem {
  description: string;
  quantity: number | null; // optional because some items don’t have quantity
  total_price: string | null;
}

export interface ReceiptData {
  merchant_name: string | null;
  transaction_date: string | null; // ISO format: YYYY-MM-DD
  transaction_time: string | null; // HH:mm:ss
  items: ReceiptItem[];
  total: string;
  tax_id: string | null;
  receipt_no: string;
  status: string;
  address: string | null;
  unit_no: string | null;
  mall_name: string | null;
  remarks: string[];
  hashed_receipt: string;
  message: string;
}

export interface ReceiptDataErrorResponse {
  detail: {
    status: string;
    http_status: number;
    message: string;
    step: string;
    extracted_data?: ReceiptData;
  };
}

const baseUrl = process.env['OCR_API_URL'] ?? 'http://localhost:3006';
class OCRClientService extends BaseHttpClient {
  
  constructor() {
    super(baseUrl, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
  }

  public async validateReceipt(
    source: string
  ): Promise<AxiosResponse<ReceiptData | ReceiptDataErrorResponse>> {
    return await this.httpClient.post<ReceiptData>(
      `/receipt-ocr?source=${source}`
    );
  }

  public async health(): Promise<AxiosResponse<any>> {
    return await this.httpClient.get(
      `/health`
    );
  }
}

const OCRClient = new OCRClientService();
export default OCRClient;
