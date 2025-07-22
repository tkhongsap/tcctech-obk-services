using MediatR;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateActivityProcedure;

public class CreateActivityProcedureCommand : AuditableModel, IRequest<CreateActivityProcedureResult>
{	
	public required string Code { get; set; }
	public required string TaskName { get; set; }
	public required List<APSubtaskActionResult> SubtaskActions { get; set; }
	public required Guid LocationId { get; set; }
}
