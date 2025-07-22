using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;

namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.SchedulePlanRepository;
public class CreateSchedulePlanModel
{
	public string Route { get; set; }
	public List<string> Frequency { get; set; }
	public TimeSpan StartTime { get; set; }
	public TimeSpan EndTime { get; set; }
	public Guid MemberId { get; set; }
	public bool IsActive { get; set; }
	public CreateSchedulePlanModel(string route, List<string> frequency, TimeSpan startTime, TimeSpan endTime, Guid memberId, bool isActive)
	{
		Route = route;
		Frequency = frequency;
		StartTime = startTime;
		EndTime = endTime;
		MemberId = memberId;
		IsActive = isActive;
	}
}
