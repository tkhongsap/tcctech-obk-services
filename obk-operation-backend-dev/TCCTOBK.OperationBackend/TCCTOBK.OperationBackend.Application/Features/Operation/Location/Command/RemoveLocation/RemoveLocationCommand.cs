

using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.RemoveLocation;

public class RemoveLocationCommand : AuditableModel, ICommand<int>
{
	public Guid LID { get; set; }
	public RemoveLocationCommand(string lid)
	{
		LID = Guid.Parse(lid);
	}
}