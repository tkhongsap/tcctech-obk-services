using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.WFM.Command.StaffClockIn;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.WFM.Command.StaffClockOut;
using TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.WFM.Query.DutyShifts;

namespace TCCT.ServiceAbstraction.Application.Contracts.Certis.Transaction;
public interface ICertisTransactionWFMService
{
	Task<StaffClockInResult> StaffClockIn(StaffClockInCommand data);
	Task<StaffClockOutResult> StaffClockOut(StaffClockOutCommand data);
	Task<List<DutyShiftsResult>> DutyShifts(DutyShiftsQuery data);
}
