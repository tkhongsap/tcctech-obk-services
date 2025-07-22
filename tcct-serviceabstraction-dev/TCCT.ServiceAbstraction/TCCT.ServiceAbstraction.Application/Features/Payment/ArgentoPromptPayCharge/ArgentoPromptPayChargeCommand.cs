using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Payment.ArgentoPromptPayCharge;
public class ArgentoPromptPayChargeCommand : ICommand<ArgentoPromptPayChargeResult>
{
	public string InvoiceNo { get; set; }
	public string Description { get; set; }
	public decimal Amount { get; set; }
	public string SubCode { get; set; }
	public bool? Cache { get; set; }

	public ArgentoPromptPayChargeCommand(string invoiceno, string description, decimal amount, string subCode, bool? cache = false)
	{
		InvoiceNo = invoiceno;
		Description = description;
		Amount = amount;
		SubCode = subCode;
		Cache = cache;
	}
}
