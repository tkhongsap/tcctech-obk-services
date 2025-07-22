

using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.RemoveSchedulePlan;

public class RemoveSchedulePlanCommand : AuditableModel, ICommand<int>
{
	public Guid SDPID { get; set; }
	public RemoveSchedulePlanCommand(string sdpid)
	{
		SDPID = Guid.Parse(sdpid);
	}
}