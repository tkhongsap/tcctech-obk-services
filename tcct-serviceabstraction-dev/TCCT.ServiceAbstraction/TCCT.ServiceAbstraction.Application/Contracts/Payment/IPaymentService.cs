using TCCT.ServiceAbstraction.Application.Features.Payment.ArgentoInquiryPaymentTransaction;
using TCCT.ServiceAbstraction.Application.Features.Payment.ArgentoPromptPayCharge;
using TCCT.ServiceAbstraction.Application.Features.Payment;
namespace TCCT.ServiceAbstraction.Application.Contracts.Payment;

public interface IPaymentService
{
	Task<ArgentoPaymentSourceResponse> ArgentoPaymentSource(string invoiceNo, string description, decimal amount, string currency, string paymentChannel, string? subCode = null);
	Task<ArgentoPromptPayChargeResult> ArgentoChargePromptPay(string description, string sourceId, int qrTimeout, string? subCode = null);
	Task<ArgentoInquiryPaymentTransactionResult> ArgentoInquiryPaymentTransaction(string transactionno, string? subCode = null);
}
