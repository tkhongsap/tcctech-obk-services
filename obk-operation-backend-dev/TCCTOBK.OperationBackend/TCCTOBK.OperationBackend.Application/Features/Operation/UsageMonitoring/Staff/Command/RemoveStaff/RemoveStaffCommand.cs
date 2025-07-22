

using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Staff.Command.RemoveStaff;

public class RemoveStaffCommand : ICommand<Guid>
{
	public Guid Sfid { get; set; }
	public RemoveStaffCommand(Guid sfid)
	{
		Sfid = sfid;
	}
}