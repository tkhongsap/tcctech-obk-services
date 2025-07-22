using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.WFM.Command.StaffClockOut;
public class StaffClockOutCommand : ICommand<StaffClockOutResult>
{
	public int StaffId { get; set; }
}
