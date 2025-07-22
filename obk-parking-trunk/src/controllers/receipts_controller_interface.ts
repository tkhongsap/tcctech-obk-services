import { Controller } from 'tsoa';
import { includes, set } from 'lodash';

export enum ReceiptStatus {
  DECLINED = 'DECLINED',
  SUCCESS = 'SUCCESS',
  PENDING = 'PENDING',
  DISPUTE = 'DISPUTE',
  REDEEMED = 'REDEEMED',
  PROCESSING = 'PROCESSING',
  DUPLICATED = 'DUPLICATED',
}

export interface CreateReceiptBody {
  parkingDetailId: string;
  imageUrl: string;
  email?: string;
}

export interface Receipt {
  id: string;
  total: string;
  created_at: string;
  updated_at: string;
  status: ReceiptStatus;
  message?: string;
  image_url: string;
  merchant_name?: string;
  transaction_date?: string; // Format: YYYY-MM-DD
  transaction_time?: string; // Format: HH:mm (local time GMT+7)
  items: Item[];
  tax_id?: string;
  receipt_no?: string;
  addres?: string;
  unit_no?: string;
  mall_name?: string;
  hashed_receipt?: string;
  redeemed_at?: string;
}
export interface Item {
  description: string;
  quantity?: number;
  total_price?: string; // Price in decimal format as string
}

export interface UpdateReceiptBody {
  id: string;
  merchant_name: string;
  transaction_date: string; // Format: YYYY-MM-DD
  transaction_time: string; // Format: HH:mm (local time GMT+7)
  items: Item[];
  total: string; // Total price as string
  tax_id: string;
  receipt_no: string;
  address: string;
  unit_no: string;
  mall_name: string;
  hashed_receipt: string;
  status: ReceiptStatus;
  message: string;
}

export interface GetAllReceiptQuery {
  id?: string; // Filter by receipt ID
  receipt_hashed_id?: string; // Filter by receipt hashed ID
  user_id?: string; // Filter by store name
  status?: ReceiptStatus; // Filter by status
  content?: string; // Filter by content using JSONB query (not supported under items)
  redeemed_at?: string; // ISO string - Filter by redeemed timestamp
  created_at?: string; // ISO string - Filter by creation timestamp
  total?: string; // Price in decimal format as a string
  parking_id?: string; // Filter by parking ID
}

export interface GetAllReceiptResponse {
  id: string; // GUID of the receipt
  receipt_hashed_id?: string; // Hashed from validation service
  user_id?: string; // Ticket may not have user; mobile scans do
  status: ReceiptStatus; // One of the allowed status values
  content?: Receipt; // Response from validation service
  redeemed_at?: string; // ISO string - Time when redeemed
  created_at?: string; // ISO string - Timestamp of creation
  total: string; // Price in decimal format as a string
  parking_id: string; // Parking ID
}

export abstract class QueriesReceiptController extends Controller {
  EXCLUED_KEYS = [
    'order_by',
    'order_direction',
    'page_number',
    'page_size',
    'user_id',
    'content',
  ];
  DEFAULT_PAGE_SIZE = 25;
  DEFAULT_PAGE_NUMBER = 1;

  public buildQuery<T>(query: Record<string, string | number>): T {
    const where: Record<string, string | number> = {};
    const allowedKeys = Object.keys(query).filter(
      (key) => !includes(this.EXCLUED_KEYS, key)
    ) as string[];

    allowedKeys.forEach((key) => {
      set(where, key, query[key]);
    });

    const pageSize = query.page_size
      ? parseInt(query.page_size as string)
      : this.DEFAULT_PAGE_SIZE;
    const pageNumber = query.page_number
      ? parseInt(query.page_number as string)
      : this.DEFAULT_PAGE_NUMBER;
    const offset = (pageNumber - 1) * pageSize;

    return {
      where,
      orderBy: {
        [query.order_by || 'created_at']: query.order_direction || 'asc',
      },
      take: pageSize,
      skip: offset,
    } as T;
  }

  public paginationBuilder<T>(
    total: number,
    page_size: number,
    page_number: number
  ): T {
    return {
      total,
      page_size,
      page_number,
      total_page: Math.ceil(total / page_size),
    } as T;
  }
}
