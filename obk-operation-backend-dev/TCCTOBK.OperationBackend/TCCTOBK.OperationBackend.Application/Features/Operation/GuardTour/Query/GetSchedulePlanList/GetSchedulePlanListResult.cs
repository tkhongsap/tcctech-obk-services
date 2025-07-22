using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetSchedulePlanList;

public class GetSchedulePlanList
{
	public Guid Id { get; set; }
	public string Route { get; set; } = "";
	public List<string>? Frequency { get; set; } = new();
	public TimeSpan? StartTime { get; set; }
	public TimeSpan? EndTime { get; set; }
	public string MemberName { get; set; }

    public string? MemberId { get; set; }
	public bool IsActive { get; set; }
}

public record GetSchedulePlanListResult(Paginate Paginate, List<GetSchedulePlanList> Data);