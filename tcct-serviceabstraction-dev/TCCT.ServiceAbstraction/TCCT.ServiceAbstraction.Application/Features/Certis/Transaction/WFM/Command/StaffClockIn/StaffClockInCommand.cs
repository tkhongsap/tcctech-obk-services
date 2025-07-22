using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.WFM.Command.StaffClockIn;
public class StaffClockInCommand : ICommand<StaffClockInResult>
{
	public int StaffId { get; set; }
	public int ShiftId { get; set; }
	public int FunctionRoleId { get; set; }
}