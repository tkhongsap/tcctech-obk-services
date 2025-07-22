using Refit;
using TCCTOBK.OperationBackend.Application.Features.Operation.Attendance.Model;

namespace TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;

public interface IAbstractionInnoflexService
{
	[Post("/api/v1/innoflex/attendance/log")]
	Task<AttendanceLogResult> GetAttendanceLog([Body] AttendanceLogRequest req);
}
