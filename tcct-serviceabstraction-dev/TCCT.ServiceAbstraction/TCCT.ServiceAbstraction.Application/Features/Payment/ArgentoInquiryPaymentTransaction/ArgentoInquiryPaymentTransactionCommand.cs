using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Payment.ArgentoInquiryPaymentTransaction;
public class ArgentoInquiryPaymentTransactionCommand : ICommand<ArgentoInquiryPaymentTransactionResult>
{
	public string TransactionNo { get; set; }
	public string SubCode { get; set; }

	public ArgentoInquiryPaymentTransactionCommand(string transactionno, string subCode)
	{
		TransactionNo = transactionno;
		SubCode = subCode;
	}
}
