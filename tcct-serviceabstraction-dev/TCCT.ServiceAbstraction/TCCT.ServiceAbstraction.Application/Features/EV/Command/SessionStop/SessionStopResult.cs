namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.SessionStart;

public class SessionStartResult
{
	public bool completed { get; set; }
	public string message { get; set; }
	public int errcode { get; set; }
}