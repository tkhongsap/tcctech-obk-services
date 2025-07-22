namespace TCCTOBK.OperationBackend.Application.Features.Operation.Attendance.Model;


public class AttendanceData
	{ 
	public required long LogId { get; set; }
	public string UserId { get; set; }
	public int AuthSuccessType { get; set; }
	public required string Firstname { get; set; }
	public required string Lastname { get; set; }
	public required string UserRole { get; set; }
	public required string UserCompany { get; set; }
	public required string UserBaseLocation { get; set; }
	public required string DeviceName { get; set; }
	public required string DeviceKey { get; set; }
	public required string DeviceIp { get; set; }
	public required string AuthType { get; set; }
	public required string AuthTypeDesc { get; set; }
	public required string IdCardNum { get; set; }
	public required string IdentifyTypeDesc { get; set; }
	public required string IdentifyPatternDesc { get; set; }
	public required string IdentifyDateTime { get; set; }
}

public class AttendanceLogResult
{
	public int TotalRecords { get; set; }
	public required AttendanceLogResultData Data { get; set; }
}

public class AttendanceLogResultData
{
	public required List<AttendanceData> Data { get; set; }
}

