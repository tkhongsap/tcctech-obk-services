namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.ReserveCheck;

public class ReserveCheckResult
{
	public bool completed { get; set; }
	public string message { get; set; }
	public int errcode { get; set; }
}
