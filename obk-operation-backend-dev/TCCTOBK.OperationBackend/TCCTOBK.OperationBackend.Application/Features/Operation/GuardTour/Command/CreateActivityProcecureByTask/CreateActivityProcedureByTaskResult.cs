namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateActivityProcedureByTask;

public class CreateActivityProcedureByTaskResult
{
	public bool IsSuccess { get; set; } = true;
	public Guid Id { get; set; }

	public string Message { get; set; } = "Success";
}
