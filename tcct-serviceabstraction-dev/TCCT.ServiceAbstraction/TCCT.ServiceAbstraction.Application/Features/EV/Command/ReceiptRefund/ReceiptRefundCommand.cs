using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.ReceiptRefund;

public class ReceiptRefundCommand : ICommand<ReceiptRefundResult>
{
	public string? uuid { get; set; }
	public string? reason { get; set; }
	public bool? isVoid { get; set; }
	public string? token { get; set; }
}