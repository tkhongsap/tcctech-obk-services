namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Staff.Command.UpsertStaff;

public class UpsertStaffResult
{
	public bool IsSuccess { get; set; } = true;
	public string Message { get; set; } = "Success";
	public List<string>? Errors { get; set; }
	public int? UpdateData { get; set; }
	public int? CreateData { get; set; }
}
