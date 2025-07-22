

using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.RemoveAction;

public class RemoveActionCommand : AuditableModel, ICommand<int>
{
	public Guid AID { get; set; }
	public RemoveActionCommand(string aid)
	{
		AID = Guid.Parse(aid);
	}
}