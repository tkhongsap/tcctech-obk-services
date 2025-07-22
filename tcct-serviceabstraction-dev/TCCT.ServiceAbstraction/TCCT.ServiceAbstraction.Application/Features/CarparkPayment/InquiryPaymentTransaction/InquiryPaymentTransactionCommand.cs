using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.CarparkPayment.InquiryPaymentTransaction;
public class InquiryPaymentTransactionCommand : ICommand<InquiryPaymentTransactionResult>
{
	public string TransactionNo { get; set; }
	public string? SubCode { get; set; } = null;

	public InquiryPaymentTransactionCommand(string transactionno, string? subCode = null)
	{
		TransactionNo = transactionno;
		SubCode = subCode;
	}
}
