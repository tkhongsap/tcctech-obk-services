using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.CarparkPayment.PromptPayCharge;
public class PromptPayChargeCommand : ICommand<PromptPayChargeResult>
{
	public string InvoiceNo { get; set; }
	public string Description { get; set; }
	public decimal Amount { get; set; }
	public string? SubCode { get; set; }
	public bool? Cache { get; set; }

	public PromptPayChargeCommand(string invoiceno, string description, decimal amount, string? subCode = null, bool? cache = false)
	{
		InvoiceNo = invoiceno;
		Description = description;
		Amount = amount;
		SubCode = subCode;
		Cache = cache;
	}
}
