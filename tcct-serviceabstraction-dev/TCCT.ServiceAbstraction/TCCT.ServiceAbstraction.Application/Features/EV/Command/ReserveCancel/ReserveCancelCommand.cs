using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.ReserveCancel;

public class ReserveCancelCommand : ICommand<ReserveCancelResult>
{
	public string? uuid { get; set; }
	public string? reason { get; set; }
	public string? token { get; set; }
}