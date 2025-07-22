using MediatR;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateActionType;

public class CreateActionTypeCommand : AuditableModel, IRequest<CreateActionTypeResult>
{
	public string Action { get; set; } = "";
	public Guid ATID { get; set; }
}
