namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateLocation;

public class CreateLocationResult
{
	public bool IsSuccess { get; set; } = true;
	public string Message { get; set; } = "Success";

	public Guid LID { get; set; }
}
