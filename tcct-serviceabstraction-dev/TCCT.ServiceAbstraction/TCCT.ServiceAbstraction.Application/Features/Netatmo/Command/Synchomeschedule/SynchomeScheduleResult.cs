namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.Synchomeschedule;
public class SynchomeScheduleResult
{
	public List<object>? body { get; set; }
	public string? status { get; set; }
	public double time_exec { get; set; }
	public int time_server { get; set; }
}
