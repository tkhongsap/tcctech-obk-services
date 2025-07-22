namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateActionType;

public class CreateActionTypeResult
{
	public bool IsSuccess { get; set; } = true;
	public string Message { get; set; } = "Success";

	public Guid ATID { get; set; }
}
