using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Innoflex.Query.GetAttendanceLog;
public class AttendanceLogQuery : IQuery<AttendanceLogResult>
{
	public required string AuthType { get; set; }
	public required int AuthSuccessType { get; set; }
	public string? FromDate { get; set; }
	public string? ToDate { get; set; }
	public List<string>? DeviceKeys { get; set; }
}
