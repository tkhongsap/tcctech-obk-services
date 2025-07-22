namespace TCCT.ServiceAbstraction.Application.Features.Innoflex.Query.GetAttendanceLog;
public class AttendanceLogResult
{
	public AttendanceLogStatus status { get; set; }
	public AttendanceLogData data { get; set; }
}

public class AttendanceLogStatus
{
	public required int responseCode { get; set; }
	public required string responseMessage { get; set; }
}

public class AttendanceLogData
{
	public int totalRecords { get; set; }
	public List<AttendanceLogDataList> data { get; set; }
}

public class AttendanceLogDataList
{
	public int logId { get; set; }
	public string firstName { get; set; }
	public string lastName { get; set; }
	public string userRole { get; set; }
	public string userId { get; set; }
	public string userCompany { get; set; }
	public string userBaseLocation { get; set; }
	public string deviceName { get; set; }
	public string deviceKey { get; set; }
	public string deviceIp { get; set; }
	public string authType { get; set; }
	public string authTypeDesc { get; set; }
	public string idCardNum { get; set; }
	public string identifyTypeDesc { get; set; }
	public string identifyPatternDesc { get; set; }
	public string identifyDateTime { get; set; }
}
