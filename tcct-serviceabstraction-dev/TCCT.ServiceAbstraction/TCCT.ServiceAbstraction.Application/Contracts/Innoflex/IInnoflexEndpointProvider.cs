using TCCT.ServiceAbstraction.Application.Features.Innoflex.Query.GetAttendanceLog;

namespace TCCT.ServiceAbstraction.Application.Contracts.Innoflex;
public interface IInnoflexEndpointProvider
{
	HttpClient GetClientFromFactory();
	Task<AttendanceLogResult> GetAttendanceLog(AttendanceLogQuery req);
	string OnboardResidenceUrl();
	string RevokeAccessUrl();
}
