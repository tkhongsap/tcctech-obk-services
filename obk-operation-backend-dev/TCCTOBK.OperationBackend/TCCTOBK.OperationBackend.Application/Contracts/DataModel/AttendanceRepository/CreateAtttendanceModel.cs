using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.AttendanceRepository;
public class CreateAttendanceModel
{
	public required string Shift { get; set; }
	public required string UserId { get; set; }
	public required string Firstname { get; set; }
	public required string Lastname { get; set; }
	public required string Company { get; set; }
	public required string Role { get; set; }
	public required string BaseLocation { get; set; }
	public required string DeviceKey { get; set; }
	public required string DeviceName { get; set; }
	public required string IndentifyType { get; set; }
	public required string IdentifyDate { get; set; }
	public DateTime? CheckInDateTime { get; set; }
	public DateTime? CheckOutDateTime { get; set; }
	public string? MetaData { get; set; } = default!;
	public int LateTime { get; set; } = 0;
	public Guid? CSID { get; set; } = Constant.OBK_CLIENT_SITE;
}
