

using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.RemoveActionType;

public class RemoveActionTypeCommand : AuditableModel, ICommand<int>
{
	public Guid ATID { get; set; }
	public RemoveActionTypeCommand(string atid)
	{
		ATID = Guid.Parse(atid);
	}
}