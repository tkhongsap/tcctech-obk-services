using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.EV.Command.Reserve;

public class ReserveCommand : ICommand<ReserveResult>
{
	public string? building { get; set; }
	public string? place { get; set; }
	public string? token { get; set; }
	public List<string> type { get; set; }
	public string date { get; set; }
	public string time { get; set; }
}