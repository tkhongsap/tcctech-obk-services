namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.SessionInit;

public class SessionInitResult
{
	public bool payment { get; set; }
	public string? invoice { get; set; }
	public bool completed { get; set; }
	public string message { get; set; }
	public int errcode { get; set; }
}