using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;

namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.SchedulePlanRepository;
public class UpdateSchedulePlanModel
{
	public Guid SDPID { get; set; }
	public string Route { get; set; }
	public List<string>? Frequency { get; set; } = new();
	public TimeSpan? StartTime { get; set; }
	public TimeSpan? EndTime { get; set; }
	public Guid MemberId { get; set; }
	public bool IsActive { get; set; }
	public UpdateSchedulePlanModel(Guid sdpid, string route, List<string>? frequency, TimeSpan? startTime, TimeSpan? endTime, Guid memberId, bool isActive)
	{
		SDPID = sdpid;
		Route = route;
		Frequency = frequency;
		StartTime = startTime;
		EndTime = endTime;
		MemberId = memberId;
		IsActive = isActive;
	}
}
