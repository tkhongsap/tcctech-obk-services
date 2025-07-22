using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Netatmo.Query.HomeSchedule;
public class HomeScheduleQuery : IQuery<HomeScheduleResult>
{
	public string HomeId { get; set; } = null!;

	public string ScheduleId { get; set; } = null!;
	public string? TenantId { get; set; } = null!;

	public HomeScheduleQuery() { }
	public HomeScheduleQuery(string homeId, string scheduleId, string? tenantId)
	{
		HomeId = homeId;
		ScheduleId = scheduleId;
		TenantId = tenantId;
	}
}
