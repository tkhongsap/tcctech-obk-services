namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateAction;

public class CreateActionResult
{
	public bool IsSuccess { get; set; } = true;
	public string Message { get; set; } = "Success";

	public Guid AID { get; set; }
}
