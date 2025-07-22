namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.ReserveCancel;

public class ReserveCancelResult
{
	public bool completed { get; set; }
	public string message { get; set; }
	public int errcode { get; set; }
}
