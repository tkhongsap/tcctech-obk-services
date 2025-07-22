namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.CancelInvoice;

public class CancelInvoiceResult
{
	public bool completed { get; set; }
	public string message { get; set; }
	public int errcode { get; set; }
}
