namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.CheckoutInvoice;

public class CheckoutInvoiceResult
{
	public bool completed { get; set; }
	public string message { get; set; }
	public int errcode { get; set; }
}
