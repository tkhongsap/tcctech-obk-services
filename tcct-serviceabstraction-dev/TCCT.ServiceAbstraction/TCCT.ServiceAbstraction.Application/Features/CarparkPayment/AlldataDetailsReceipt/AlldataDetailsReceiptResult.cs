namespace TCCT.ServiceAbstraction.Application.Features.CarparkPayment.AlldataDetailsReceipt;

public class AlldataDetailsReceiptResult
{
	/*
{
	"trn_Log_ID_Payment": 48508,
	"trn_Log_ID": "2024073010573806",
	"trn_Date": "2024-07-30T00:00:00",
	"trn_Terminal_ID": "201",
	"trn_User_ID": "9999",
	"trn_Shift_Running_No": 1,
	"trn_Shift_Date": "2024-07-30T00:00:00",
	"trn_Operation": null,
	"trn_Direction": null,
	"trn_Shift_Type": null,
	"trn_Log_Date": "2024-07-30T13:10:01.973",
	"trn_Ent_Date": "2024-07-30T06:57:38",
	"trn_Ent_Terminal_ID": "6",
	"trn_Vehicle_Type": "0",
	"trn_Card_UID": "0000006000002577",
	"trn_Ticket_No": "6000002577",
	"trn_Ticket_Type": null,
	"trn_Mem_Code": null,
	"trn_Mem_Type": null,
	"trn_Mem_Credit": null,
	"trn_Car_Char": null,
	"trn_Car_No": "0000000",
	"trn_Car_Prv": null,
	"trn_Rate_HH": 7,
	"trn_Park_HH": 6,
	"trn_Park_MM": 12,
	"trn_Piad_Lost": null,
	"trn_Piad_Overnight": null,
	"trn_SubCharge": 0,
	"trn_SubTotal": 0,
	"trn_Discount": 0,
	"trn_Charge": 0,
	"trn_Total": 90,
	"trn_Cash": 90,
	"trn_Refund": null,
	"trn_Piad_Card": null,
	"trn_Piad_1": null,
	"trn_Piad_2": null,
	"trn_Piad_CP": null,
	"trn_Piad_Cp_Detail": null,
	"trn_Rate_Code": 0,
	"trn_Rate_LogID": null,
	"trn_Bill_No": null,
	"trn_Tax_No": "ARG24073001730356",
	"trn_Piad_Remark": "promptpay",
	"trn_Remark": null,
	"trn_MSG": null,
	"trn_Exit_Status": null,
	"trn_Ref_Log": "ARG24073001730356",
	"trn_TaxInv_Ref": null,
	"trn_IsInv": 0,
	"trn_Inv_Pay": 0,
	"trn_Inv_Rate_HH": 0,
	"trn_Vat_Rate": 7.0000,
	"trn_Vat": 6.3000,
	"trn_Amount": 83.7000,
	"trn_Lot_No": null,
	"trn_Estamp_User": null,
	"trn_Estamp_Date": null,
	"trn_Estamp_Station": null,
	"trn_Status": 0,
	"trn_Pooling_Date": "2024-07-30T13:10:01.973",
	"trn_Fee_Type_Detail_Id": null,
	"trn_Fee_Type_Detail_Name": "promptpay",
	"trn_Fee_Percent": null,
	"trn_Fee_Amont": null,
	"trn_CreateTime": "2024-07-30T13:10:01.973",
	"trn_IsVoid": 0,
	"trn_SaleTransactionId": null,
	"trn_SaleTaxNo": null,
	"void_reason_Id": null
}
	 */

	public int? trn_Log_ID_Payment { get; set; }
	public string? trn_Log_ID { get; set; }
	public DateTime? trn_Date { get; set; }
	public string? trn_Terminal_ID { get; set; }
	public string? trn_User_ID { get; set; }
	public int? trn_Shift_Running_No { get; set; }
	public DateTime? trn_Shift_Date { get; set; }
	public string? trn_Operation { get; set; }
	public int? trn_Direction { get; set; }
	public int? trn_Shift_Type { get; set; }
	public DateTime? trn_Log_Date { get; set; }
	public DateTime? trn_Ent_Date { get; set; }
	public string? trn_Ent_Terminal_ID { get; set; }
	public string? trn_Vehicle_Type { get; set; }
	public string? trn_Card_UID { get; set; }
	public string? trn_Ticket_No { get; set; }
	public string? trn_Ticket_Type { get; set; }
	public string? trn_Mem_Code { get; set; }
	public string? trn_Mem_Type { get; set; }
	public decimal? trn_Mem_Credit { get; set; }
	public string? trn_Car_Char { get; set; }
	public string? trn_Car_No { get; set; }
	public string? trn_Car_Prv { get; set; }
	public int? trn_Rate_HH { get; set; }
	public int? trn_Park_HH { get; set; }
	public int? trn_Park_MM { get; set; }
	public decimal? trn_Piad_Lost { get; set; }
	public decimal? trn_Piad_Overnight { get; set; }
	public decimal? trn_SubCharge { get; set; }
	public decimal? trn_SubTotal { get; set; }
	public decimal? trn_Discount { get; set; }
	public decimal? trn_Charge { get; set; }
	public decimal? trn_Total { get; set; }
	public decimal? trn_Cash { get; set; }
	public decimal? trn_Refund { get; set; }
	public decimal? trn_Piad_Card { get; set; }
	public decimal? trn_Piad_1 { get; set; }
	public decimal? trn_Piad_2 { get; set; }
	public decimal? trn_Piad_CP { get; set; }
	public string? trn_Piad_Cp_Detail { get; set; }
	public int? trn_Rate_Code { get; set; }
	public string? trn_Rate_LogID { get; set; }
	public string? trn_Bill_No { get; set; }
	public string? trn_Tax_No { get; set; }
	public string? trn_Piad_Remark { get; set; }
	public string? trn_Remark { get; set; }
	public string? trn_MSG { get; set; }
	public int? trn_Exit_Status { get; set; }
	public string? trn_Ref_Log { get; set; }
	public string? trn_TaxInv_Ref { get; set; }
	public int? trn_IsInv { get; set; }
	public decimal? trn_Inv_Pay { get; set; }
	public int? trn_Inv_Rate_HH { get; set; }
	public decimal? trn_Vat_Rate { get; set; }
	public decimal? trn_Vat { get; set; }
	public decimal? trn_Amount { get; set; }
	public int? trn_Lot_No { get; set; }
	public string? trn_Estamp_User { get; set; }
	public DateTime? trn_Estamp_Date { get; set; }
	public string? trn_Estamp_Station { get; set; }
	public int? trn_Status { get; set; }
	public DateTime? trn_Pooling_Date { get; set; }
	public int? trn_Fee_Type_Detail_Id { get; set; }
	public string? trn_Fee_Type_Detail_Name { get; set; }
	public decimal? trn_Fee_Percent { get; set; }
	public decimal? trn_Fee_Amont { get; set; }
	public DateTime? trn_CreateTime { get; set; }
	public int? trn_IsVoid { get; set; }
	public string? trn_SaleTransactionId { get; set; }
	public string? trn_SaleTaxNo { get; set; }
	public string? void_reason_Id { get; set; }

}
