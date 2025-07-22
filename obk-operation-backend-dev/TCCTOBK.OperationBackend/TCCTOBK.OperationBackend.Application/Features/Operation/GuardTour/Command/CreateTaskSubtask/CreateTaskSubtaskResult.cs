namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateTaskSubtask;

public class CreateTaskSubtaskResult
{
	public bool IsSuccess { get; set; } = true;
	public Guid Id { get; set; }
	public string Message { get; set; } = "Success";
}
