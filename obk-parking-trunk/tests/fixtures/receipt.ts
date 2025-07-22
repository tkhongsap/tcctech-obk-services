export const MOCK_OCR_RECEIPT = [
  {
    merchant_name: 'Brewing Happiness Co.,Ltd.',
    transaction_date: '2025-02-04',
    transaction_time: '14:04',
    items: [
      {
        description: 'Iced Americano - Floral',
        quantity: 1,
        total_price: '550.00',
      },
      {
        description: 'Iced Cappuccino - Floral',
        quantity: 1,
        total_price: '550.00',
      },
    ],
    total: '1,110.00',
    tax_id: '105560101035',
    receipt_no: '10344001022500156',
    address:
      '1877 One Bangkok Parade Building 1520 RoomRama4 Rd. Lumpini Pathumwan Bangkok 10330',
    unit_no: '1520',
    mall_name: 'One Bangkok',
    hashed_receipt:
      'e6c8d18f08a8632c8c313218d0d6270d57a117215dc6d7a1eab4b313af16da36',
    status: 'valid',
    message: 'valid',
    remarks: [],
  },
  {
    merchant_name: 'Thai yamazaki Co.,Ltd.',
    transaction_date: '2025-06-23',
    transaction_time: '14:04',
    items: [
      { description: 'บัตเตอร์เฟร้นซ์', quantity: 1, total_price: null },
      { description: 'พายไก่', quantity: null, total_price: null },
    ],
    total: '55.0',
    tax_id: '0125560008744',
    receipt_no: '10344001022500156',
    address: null,
    unit_no: null,
    mall_name: 'One Bangkok',
    hashed_receipt:
      '54241a863f9bdf7760556e4b68c49659bfacf4c7715513125451c45d6297b59d',
    status: 'valid',
    message: 'valid',
    remarks: [
      'address',
      'unit_no',
      'items_total_price_0',
      'items_quantity_1',
      'items_total_price_1',
    ],
  },
];
