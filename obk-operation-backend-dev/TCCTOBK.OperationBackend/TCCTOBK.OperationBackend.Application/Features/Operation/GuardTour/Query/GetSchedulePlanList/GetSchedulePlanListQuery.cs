using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetSchedulePlanList;
public class GetSchedulePlanListQuery : TableState, IQuery<GetSchedulePlanListResult>
{
	public string? Filter { get; set; }
	public Guid? SchedulePlanId { get; set; }
	public List<Guid> SchedulePlanIds { get; set; } = new();
	public TimeOnly? StartTime { get; set; }
	public TimeOnly? EndTime { get; set; }
	public bool? IsActive { get; set; }
}