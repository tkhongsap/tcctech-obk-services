using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.CheckoutInvoice;

public class CheckoutInvoiceCommand : ICommand<CheckoutInvoiceResult>
{
	public string? uuid { get; set; }
	public string? tendor { get; set; }
	public string? method { get; set; }
	public string? token { get; set; }
}