namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateSchedulePlan;

public class CreateSchedulePlanResult
{
	public bool IsSuccess { get; set; } = true;
	public string Message { get; set; } = "Success";

	public List<Guid> SchedulePlanIds { get; set; }
}
