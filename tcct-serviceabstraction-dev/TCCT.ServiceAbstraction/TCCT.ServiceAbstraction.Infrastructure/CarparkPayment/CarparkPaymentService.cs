using TCCT.ServiceAbstraction.Application.Contracts.CarparkPayment;
using TCCT.ServiceAbstraction.Application.Features.CarparkPayment;
using TCCT.ServiceAbstraction.Application.Features.CarparkPayment.GetParkingDetail;
using TCCT.ServiceAbstraction.Application.Features.CarparkPayment.InquiryPaymentTransaction;
using TCCT.ServiceAbstraction.Application.Features.CarparkPayment.PromptPayCharge;
using TCCT.ServiceAbstraction.Application.Features.CarparkPayment.TrueMoneyOnlineCharge;
using TCCT.ServiceAbstraction.Application.Features.CarparkPayment.AlldataDetailsReceipt;
using TCCT.ServiceAbstraction.Application.Features.CarparkPayment.GenerateReceipt;
using TCCT.ServiceAbstraction.Infrastructure.CarparkPayment;
using TCCT.ServiceAbstraction.Application.Exceptions;

namespace TCCT.ServiceAbstraction.Infrastructure.FinedayIviva;
public class CarparkPaymentService(ICarparkPaymentEndpointProvider endpointprovider) : ICarparkPaymentService
{
	private readonly ICarparkPaymentEndpointProvider _endpointprovider = endpointprovider;

	public async Task<GetParkingDetailResult> GetParkingDetail(string search, bool lostcard)
	{
		return await _endpointprovider.GetParkingDetail(search, lostcard);
	}

	public async Task<InquiryPaymentTransactionResult> InquiryPaymentTransaction(string transactionno, string? subCode = null)
	{
		return await _endpointprovider.InquiryPaymentTransaction(transactionno, subCode);
	}

	public async Task<ArgentoPaymentSourceResponse> ArgentoPaymentSource(string invoiceno, string description, decimal amount, string currency, string paymentchannel, string? subCode = null)
	{
		return await _endpointprovider.ArgentoPaymentSource(invoiceno, description, amount, currency, paymentchannel, subCode);
	}
	public async Task<PromptPayChargeResult> ArgentoChargePromptPay(string description, string sourceid, int qrtimeout, string? subCode = null)
	{
		return await _endpointprovider.ArgentoChargePromptPay(description, sourceid, qrtimeout, subCode);
	}
	public async Task<TrueMoneyOnlineChargeResult> ArgentoChargeTrueMoneyOnline(string description, string sourceid, int qrtimeout, string productimageurl)
	{
		return await _endpointprovider.ArgentoChargeTrueMoneyOnline(description, sourceid, qrtimeout, productimageurl);
	}

	public async Task<List<AlldataDetailsReceiptResult>> AlldataDetailsReceipt(string logid)
	{
		return await _endpointprovider.AlldataDetailsReceipt(logid);
	}

	public async Task<GenerateReceiptResult> GenerateReceipt(string logid, int paymentid, string type, string? subCode = null)
	{
		var receipts = await _endpointprovider.AlldataDetailsReceipt(logid);
		var receipt = receipts.FirstOrDefault(x => x.trn_Log_ID_Payment == paymentid);
		var company = "One Bangkok Co., Ltd.";
		var address1 = "No. 183 Witthayu Road, Lumphini,";
		var address2 = "Pathum Wan, Bangkok 10330.";
		var address3 = "(Branch 00001)";
		var headerReceipt = "Receipt / Tax Invoice (ABB)";
		if (receipt == null) throw CarparkPaymentServiceException.CPS008;

		if(type == "")
		{
			type = "Web Payment";
		}

		if (subCode != null && subCode.Contains("ONE89") && type == "Residential")
		{
			company = "ONE89 wireless";
			address1 = "No. 189 Witthayu Road, Lumphini,";
			address2 = "Pathumwan, Bangkok 10330";
			address3 = "";
			headerReceipt = "Receipt / Tax Invoice";
		} else if (subCode != null && subCode.Contains("EI8HTEEN") && type == "Residential")
		{
			company = "EI8HTEEN SEVEN";
			address1 = "No. 187 Witthayu Road, Lumphini,";
			address2 = "Pathumwan, Bangkok 10330";
			address3 = "";
			headerReceipt = "Receipt / Tax Invoice";
		}

		var res = new GenerateReceiptResult();
		var rd = new ReceiptDrawing();
		rd.Company = company;
		rd.Address1 = address1;
		rd.Address2 = address2;
		rd.Address3 = address3;
		rd.HeaderReceipt = headerReceipt;
		rd.TerminalId = type;
		rd.TaxInvoiceId = "0105557011667";
		rd.DateTime = (receipt.trn_Log_Date != null) ? Convert.ToDateTime(receipt.trn_Log_Date).ToString("dd/MM/yyyy HH:mm:ss") : "";
		rd.TaxNo = receipt.trn_Tax_No;
		rd.BillDate = (receipt.trn_Date != null) ? Convert.ToDateTime(receipt.trn_Date).ToString("dd/MM/yyyy HH:mm:ss") : "";
		rd.UserId = receipt.trn_User_ID;
		rd.CarId = receipt.trn_Car_No;
		rd.TicketNo = receipt.trn_Ticket_No;
		rd.EntryTime = (receipt.trn_Ent_Date != null) ? Convert.ToDateTime(receipt.trn_Ent_Date).ToString("dd/MM/yyyy HH:mm:ss") : "";
		rd.ExitTime = (receipt.trn_Log_Date != null) ? Convert.ToDateTime(receipt.trn_Log_Date).ToString("dd/MM/yyyy HH:mm:ss") : "";
		rd.PaidTime = (receipt.trn_Log_Date != null) ? Convert.ToDateTime(receipt.trn_Log_Date).ToString("dd/MM/yyyy HH:mm:ss") : "";
		rd.ParkTime += (receipt.trn_Park_HH != null) ? $"{receipt.trn_Park_HH.Value.ToString("D2")}" : "0";
		rd.ParkTime += (receipt.trn_Park_MM != null) ? $":{receipt.trn_Park_MM.Value.ToString("D2")}" : ":0";
		rd.Stamp = (receipt.trn_Ent_Date != null) ? receipt.trn_Rate_Code.Value.ToString("#,##0.00") : "";
		rd.SubTotal = (receipt.trn_SubTotal != null) ? receipt.trn_SubTotal.Value.ToString("#,##0.00"): "";
		rd.Discount = (receipt.trn_Discount != null) ? receipt.trn_Discount.Value.ToString("#,##0.00"): "";
		rd.TotalVat = (receipt.trn_Amount != null) ? receipt.trn_Amount.Value.ToString("#,##0.00"): "";
		rd.Vat = (receipt.trn_Vat != null) ? receipt.trn_Vat.Value.ToString("#,##0.00"): "";
		rd.Total = (receipt.trn_Total != null) ? receipt.trn_Total.Value.ToString("#,##0.00"): "";

		res.image = rd.GetReceiptBase64();
		return res;
	}
}
