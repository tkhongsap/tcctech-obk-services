using Google.Apis.Util;
using MediatR;
using System.Globalization;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
namespace TCCTOBK.OperationBackend.Application.Features.Operation.Attendance.Command.ImportLog;

public enum AttendanceTypeOptions
{
	[StringValue("checkin")]
	checkin,
	[StringValue("checkout")]
	checkout
}

public class ImportLogCommand : AuditableModel, IRequest<ImportLogResult>
{

	private string? _attendanceType;

	// Property with validation against enum values
	public string? AttendanceType
	{
		get => _attendanceType;
		set
		{
			if (Enum.TryParse(value, out AttendanceTypeOptions result))
			{
				_attendanceType = value;
			}
			else
			{
				throw new ArgumentException($"Invalid value '{value}' for AttendanceType ['checkin', 'checkout'].");
			}
		}
	}
	public string ShiftName { get; set; }

	private string _identifyDate;

	public string? IdentifyDate
	{
		get { return _identifyDate; }
		set
		{
			DateTime parsedDate;
			if (DateTime.TryParseExact(value, "yyyy-MM-dd", null, DateTimeStyles.None, out parsedDate))
			{
				_identifyDate = value;
			}
			else
			{
				throw new ArgumentException("Invalid IdentifyDate format. Please use yyyy-MM-dd format.");
			}
		}
	}
	public List<string>? DeviceKeys { get; set; }
}