namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Staff.Query.CreateStaff;

public class CreateStaffResult
{
	public bool IsSuccess { get; set; } = true;
	public string Message { get; set; } = "Success";

	public int Id { get; set; }
}
