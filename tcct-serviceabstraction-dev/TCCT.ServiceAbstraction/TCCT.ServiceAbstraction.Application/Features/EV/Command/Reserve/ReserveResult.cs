namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.Reserve;

public class ReserveResult
{
	public string reservation { get; set; }
	public bool completed { get; set; }
	public string message { get; set; }
	public int errcode { get; set; }
}
