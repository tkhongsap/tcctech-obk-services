using TCCT.ServiceAbstraction.Application.Features.CarparkPayment;
using TCCT.ServiceAbstraction.Application.Features.CarparkPayment.GetParkingDetail;
using TCCT.ServiceAbstraction.Application.Features.CarparkPayment.InquiryPaymentTransaction;
using TCCT.ServiceAbstraction.Application.Features.CarparkPayment.PromptPayCharge;
using TCCT.ServiceAbstraction.Application.Features.CarparkPayment.TrueMoneyOnlineCharge;
using TCCT.ServiceAbstraction.Application.Features.CarparkPayment.AlldataDetailsReceipt;
using TCCT.ServiceAbstraction.Application.Features.CarparkPayment.GenerateReceipt;

namespace TCCT.ServiceAbstraction.Application.Contracts.CarparkPayment;
public interface ICarparkPaymentEndpointProvider
{
	Task<GetParkingDetailResult> GetParkingDetail(string search, bool lostcard);
	Task<InquiryPaymentTransactionResult> InquiryPaymentTransaction(string transactionno, string? subCode);

	Task<ArgentoPaymentSourceResponse> ArgentoPaymentSource(string invoiceNo, string description, decimal amount, string currency, string paymentChannel, string? subCode = null);
	Task<PromptPayChargeResult> ArgentoChargePromptPay(string description, string sourceId, int qrTimeout, string? subCode = null);
	Task<TrueMoneyOnlineChargeResult> ArgentoChargeTrueMoneyOnline(string description, string sourceId, int qrTimeout, string productImageUrl);
	Task<List<AlldataDetailsReceiptResult>> AlldataDetailsReceipt(string logid);
}
