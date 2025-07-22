namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.ReceiptRefund;

public class ReceiptRefundResult
{
	public bool completed { get; set; }
	public string message { get; set; }
	public int errcode { get; set; }
}
