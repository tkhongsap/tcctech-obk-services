namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Roster.Command.UpsertRoster;

public class UpsertRosterResult
{
	public bool IsSuccess { get; set; } = true;
	public string Message { get; set; } = "Success";

	public Guid? Id { get; set; }
}
