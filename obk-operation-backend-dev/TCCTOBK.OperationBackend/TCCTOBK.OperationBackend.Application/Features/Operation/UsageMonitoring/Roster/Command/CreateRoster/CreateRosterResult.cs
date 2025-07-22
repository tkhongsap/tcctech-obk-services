namespace TCCTOBK.OperationBackend.Application.Features.UsageMonitoring.Operation.Roster.Command.CreateRoster;

public class CreateRosterResult
{
	public bool IsSuccess { get; set; } = true;
	public string Message { get; set; } = "Success";

	public int Id { get; set; }
}
