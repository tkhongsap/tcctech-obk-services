using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetCallBackPayment;
public class GetCallBackPaymentCommand : ICommand<GetCallBackPaymentResult>
{
	public GetCallBackPaymentCommandBody PaymentPayload { get; set; }
}
public class GetCallBackPaymentCommandBody
{
	public string? transactionNo { get; set; }
	public string? invoiceNo { get; set; }
	public string? transactionDate { get; set; }
	public string? status { get; set; }
	public string? paymentChannel { get; set; }
	public decimal? amount { get; set; }
	public decimal? paidAmount { get; set; }
}

	