namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpsertShiftManPowerCommand;

public class UpsertShiftManPowerCommandResult
{
	public bool IsSuccess { get; set; } = true;
	public string Message { get; set; } = "Success";

	public int? Id { get; set; }
}
