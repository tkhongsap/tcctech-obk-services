namespace TCCTOBK.OperationBackend.Application.Features.Operation.Attendance.Model;
public class AttendanceLogRequest
{
	public required string AuthType { get; set; }
	public required int AuthSuccessType { get; set; }
	public string? FromDate { get; set; }
	public string? ToDate { get; set; }
	public List<string>? DeviceKeys { get; set; }
}
