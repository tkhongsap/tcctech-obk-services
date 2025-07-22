using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.CarparkPayment.TrueMoneyOnlineCharge;
public class TrueMoneyOnlineChargeCommand : ICommand<TrueMoneyOnlineChargeResult>
{
	public string InvoiceNo { get; set; }
	public string Description { get; set; }
	public decimal Amount { get; set; }

	public TrueMoneyOnlineChargeCommand(string invoiceno, string description, decimal amount)
	{
		InvoiceNo = invoiceno;
		Description = description;
		Amount = amount;
	}
}
