using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.CancelInvoice;

public class CancelInvoiceCommand : ICommand<CancelInvoiceResult>
{
	public string? uuid { get; set; }
	public string? reason { get; set; }
	public string? token { get; set; }
}