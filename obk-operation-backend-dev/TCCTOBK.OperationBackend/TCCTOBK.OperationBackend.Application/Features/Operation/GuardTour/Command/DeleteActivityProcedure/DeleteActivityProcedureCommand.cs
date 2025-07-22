using MediatR;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.DeleteActivityProcedure;

public class DeleteActivityProcedureCommand : AuditableModel, IRequest<DeleteActivityProcedureResult>
{
	public Guid Id { get; set; }
	public DeleteActivityProcedureCommand(string id)
	{
		Id = Guid.Parse(id);
	}
}
