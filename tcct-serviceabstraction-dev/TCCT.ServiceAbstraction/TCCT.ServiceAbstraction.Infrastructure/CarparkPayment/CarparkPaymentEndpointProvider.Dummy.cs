namespace TCCT.ServiceAbstraction.Infrastructure.CarparkPayment;
public partial class CarparkPaymentEndpointProvider
{
	public static string GetParkingDetailJson()
	{
		return @"[{
	""status"": null,
	""message"": ""คำานวณเรียบร้อยแล้ว"",
	""exeption"": null,
	""logId"": ""2024061912084410"",
	""ticketNo"": ""1000008598"",
	""ticketUid"": ""0000001000008598"",
	""plateNo"": ""2ขช6106"",
	""exitStatus"": 0,
	""terminalInId"": 10,
	""terminalInName"": ""E2_B1M_M_IN1"",
	""memberTypeId"": 0,
	""memberTypeName"": ""VISITOR"",
	""vehicleTypeId"": 1,
	""vehicleTypeName"": ""MOTORCYCLE"",
	""entryDateTime"": ""2024-06-19 12:08:44"",
	""logDateTime"": ""2024-06-19 13:23:53"",
	""isCardLost"": false,
	""parkHH"": 1,
	""parkMM"": 15,
	""rateHH"": 2,
	""freeHH"": 0,
	""rateCode"": ""0"",
	""rateDetailTH"": ""คิดชั่วโมงละ 30 บาท"",
	""rateDetailEN"": ""30 Baht Per Hour"",
	""tenantId"": ""1"",
	""tenantName"": ""ABC Mockup Company"",
	""subTotal"": 60,
	""discount"": 0,
	""parkFee"": 60,
	""cardLostFine"": 0,
	""overNightFine"": 0,
	""total"": 60,
	""isInv"": false,
	""invRateHH"": 0,
	""invFee"": 0,
	""isPayAtKiosk"": false,
	""lastDateTimePaymentAtKiosk"": null,
	""payAtKioskAll"": 0,
	""timeUsedInMinute"": 0,
	""durationInMinute"": 0,
	""remainInMinute"": 0
}]";
	}

	public static string GetPaymentWithArgentoTechJson()
	{
		return @"{
	""respCode"": ""0000"",
	""respDesc"": ""success"",
	""sourceId"": ""eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MTg4NjQ4MDQsInVzZXIiOnsiTWVyY2hhbnRJRCI6IjAwODcwMTk0LTU2NWUtNDI0Mi1hYzgwLWJjNDE4MGE1ODQ0MCIsIkludm9pY2VObyI6IjIwMjQwNjE5MTIwODQ0MTAiLCJEZXNjcmlwdGlvbiI6IlBheW1lbnQiLCJBbW91bnQiOjYwLjAsIkN1cnJlbmN5IjoiVEhCIiwiUGF5bWVudENoYW5uZWwiOiJwcm9tcHRwYXkifX0.ul0_2P7bA2cOfplVqVUV79Nwm6LEh1bQOiA61-KY23I"",
	""webPaymentUrl"": ""https://payment-merchant-sandbox.argentotech.co/merchantlandingpage/landingpage/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MTg4NjQ4MDQsInVzZXIiOnsiTWVyY2hhbnRJRCI6IjAwODcwMTk0LTU2NWUtNDI0Mi1hYzgwLWJjNDE4MGE1ODQ0MCIsIkludm9pY2VObyI6IjIwMjQwNjE5MTIwODQ0MTAiLCJEZXNjcmlwdGlvbiI6IlBheW1lbnQiLCJBbW91bnQiOjYwLjAsIkN1cnJlbmN5IjoiVEhCIiwiUGF5bWVudENoYW5uZWwiOiJwcm9tcHRwYXkifX0.ul0_2P7bA2cOfplVqVUV79Nwm6LEh1bQOiA61-KY23I""
}";
	}
	public string GetPromptPayPaymentJson()
	{
		return @"{
	""respCode"": ""0000"",
	""respDesc"": ""success"",
	""qrImage"": ""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"",
	""transactionNo"": ""ARG24061901728294"",
	""qrId"": ""qr_test_21231ce2fcc3922754129861a99e07e7dcc84"",
	""qrTimeOut"": 3
}";
	}
	public string GetInquiryPaymentTransactionJson()
	{
		return @"{
	""transactionNo"": ""ARG24061901728294"",
	""invoiceNo"": ""2024061912084410"",
	""transactionDate"": ""2024-06-19 13:38:43"",
	""merchantId"": ""00870194-565e-4242-ac80-bc4180a58440"",
	""merchantName"": ""Parking One Bangkok"",
	""paymentChannel"": ""promptpay"",
	""amount"": 60,
	""paidAmount"": null,
	""fee"": 0,
	""feeVat"": 0,
	""balance"": 0,
	""transactionStatusId"": 3,
	""description"": ""Thai Qr"",
	""deviceProfileId"": null
}";
	}

	public static string AlldataDetailsReceiptJson()
	{
		return @"[{
	""trn_Log_ID_Payment"": 48508,
	""trn_Log_ID"": ""2024073010573806"",
	""trn_Date"": ""2024-07-30T00:00:00"",
	""trn_Terminal_ID"": ""201"",
	""trn_User_ID"": ""9999"",
	""trn_Shift_Running_No"": 1,
	""trn_Shift_Date"": ""2024-07-30T00:00:00"",
	""trn_Operation"": null,
	""trn_Direction"": null,
	""trn_Shift_Type"": null,
	""trn_Log_Date"": ""2024-07-30T13:10:01.973"",
	""trn_Ent_Date"": ""2024-07-30T06:57:38"",
	""trn_Ent_Terminal_ID"": ""6"",
	""trn_Vehicle_Type"": ""0"",
	""trn_Card_UID"": ""0000006000002577"",
	""trn_Ticket_No"": ""6000002577"",
	""trn_Ticket_Type"": null,
	""trn_Mem_Code"": null,
	""trn_Mem_Type"": null,
	""trn_Mem_Credit"": null,
	""trn_Car_Char"": null,
	""trn_Car_No"": ""0000000"",
	""trn_Car_Prv"": null,
	""trn_Rate_HH"": 7,
	""trn_Park_HH"": 6,
	""trn_Park_MM"": 12,
	""trn_Piad_Lost"": null,
	""trn_Piad_Overnight"": null,
	""trn_SubCharge"": 0,
	""trn_SubTotal"": 0,
	""trn_Discount"": 0,
	""trn_Charge"": 0,
	""trn_Total"": 90,
	""trn_Cash"": 90,
	""trn_Refund"": null,
	""trn_Piad_Card"": null,
	""trn_Piad_1"": null,
	""trn_Piad_2"": null,
	""trn_Piad_CP"": null,
	""trn_Piad_Cp_Detail"": null,
	""trn_Rate_Code"": 0,
	""trn_Rate_LogID"": null,
	""trn_Bill_No"": null,
	""trn_Tax_No"": ""ARG24073001730356"",
	""trn_Piad_Remark"": ""promptpay"",
	""trn_Remark"": null,
	""trn_MSG"": null,
	""trn_Exit_Status"": null,
	""trn_Ref_Log"": ""ARG24073001730356"",
	""trn_TaxInv_Ref"": null,
	""trn_IsInv"": 0,
	""trn_Inv_Pay"": 0,
	""trn_Inv_Rate_HH"": 0,
	""trn_Vat_Rate"": 7.0000,
	""trn_Vat"": 6.3000,
	""trn_Amount"": 83.7000,
	""trn_Lot_No"": null,
	""trn_Estamp_User"": null,
	""trn_Estamp_Date"": null,
	""trn_Estamp_Station"": null,
	""trn_Status"": 0,
	""trn_Pooling_Date"": ""2024-07-30T13:10:01.973"",
	""trn_Fee_Type_Detail_Id"": null,
	""trn_Fee_Type_Detail_Name"": ""promptpay"",
	""trn_Fee_Percent"": null,
	""trn_Fee_Amont"": null,
	""trn_CreateTime"": ""2024-07-30T13:10:01.973"",
	""trn_IsVoid"": 0,
	""trn_SaleTransactionId"": null,
	""trn_SaleTaxNo"": null,
	""void_reason_Id"": null
}]";
	}

}
