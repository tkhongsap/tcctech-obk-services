using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.CarparkPayment.GenerateReceipt;
public class GenerateReceiptCommand : ICommand<GenerateReceiptResult>
{
	public string LogId { get; set; }
	public int PaymentId { get; set; }
	public string Type { get; set; }
	public string? SubCode { get; set; } 

	public GenerateReceiptCommand(string logid, int paymentid, string type, string? subCode = null)
	{
		LogId = logid;
		PaymentId = paymentid;
		Type = type;
		SubCode = subCode;
	}
}
