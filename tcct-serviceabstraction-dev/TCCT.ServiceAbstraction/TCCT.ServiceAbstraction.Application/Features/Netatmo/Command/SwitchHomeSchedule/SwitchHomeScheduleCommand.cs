using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Command.SwitchHomeSchedule;
public class SwitchHomeScheduleCommand : ICommand<SwitchHomeScheduleResult>
{
	// public string home_id { get; set; }
	// public string schedule_id { get; set; }
	// public string Schedule_type { get; set; }
	// public string operation { get; set; }
	public string Operation { get; set; } // activate or deactivate
	public string HomeId { get; set; }
	public string? ScheduleId { get; set; }
	public string ScheduleType { get; set; }
	public bool Selected { get; set; }
	public string? TenantId { get; set; }

	public SwitchHomeScheduleCommand(SwitchHomeScheduleRequest request)
	{
		Operation = request.operation;
		HomeId = request.homeid;
		ScheduleId = request.scheduleid;
		ScheduleType = request.scheduletype;
		Selected = (bool)(request.selected.HasValue ? request.selected : false);
		TenantId = request.tenantid;
	}
}