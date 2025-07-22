using TCCT.ServiceAbstraction.Application.Features.Innoflex.Query.GetAttendanceLog;
using TCCT.ServiceAbstraction.Application.Features.Innoflex.Command.OnboardResidence;
using TCCT.ServiceAbstraction.Application.Features.Innoflex.Command.RevokeAccess;

namespace TCCT.ServiceAbstraction.Application.Contracts.Innoflex;
public interface IInnoflexService
{
	Task<AttendanceLogResult> GetAttendanceLog(AttendanceLogQuery req);
	Task<OnboardResidenceResult> OnboardResidence(OnboardResidenceCommand req);
	Task<RevokeAccessResult> RevokeAccess(RevokeAccessCommand req);
}
