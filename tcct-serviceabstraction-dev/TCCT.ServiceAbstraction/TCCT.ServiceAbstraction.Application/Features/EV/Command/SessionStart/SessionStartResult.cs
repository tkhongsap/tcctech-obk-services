namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.SessionStop;

public class SessionStopResult
{
	public bool completed { get; set; }
	public string message { get; set; }
	public int errcode { get; set; }
}