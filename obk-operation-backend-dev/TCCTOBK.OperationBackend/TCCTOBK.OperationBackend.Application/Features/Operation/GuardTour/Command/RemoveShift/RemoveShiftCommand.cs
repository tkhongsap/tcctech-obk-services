

using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.RemoveShift;

public class RemoveShiftCommand : AuditableModel, ICommand<int>
{
	public int Id { get; set; }
	public RemoveShiftCommand(int id)
	{
		Id = Id;
	}
}