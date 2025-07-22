

using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.RemoveShiftManPower;

public class RemoveShiftManPowerCommand : AuditableModel, ICommand<int>
{
	public int MPID { get; set; }
	public RemoveShiftManPowerCommand(int mpid)
	{
		MPID = mpid;
	}
}