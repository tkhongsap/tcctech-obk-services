namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateShift;

public class CreateShiftResult
{
	public bool IsSuccess { get; set; } = true;
	public string Message { get; set; } = "Success";

	public int Id { get; set; }
}
