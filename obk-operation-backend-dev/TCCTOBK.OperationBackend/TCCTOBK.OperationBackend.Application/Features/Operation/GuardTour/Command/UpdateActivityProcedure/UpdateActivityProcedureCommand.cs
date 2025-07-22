using MediatR;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateActivityProcedure;

public class UpdateActivityProcedureCommand : AuditableModel, IRequest<UpdateActivityProcedureResult>
{	
	public Guid Id { get; set; }
	public required string Code { get; set; }
	public required string TaskName { get; set; }
	public required List<APSubtaskActionResult> SubtaskActions { get; set; }
	public required Guid LocationId { get; set; }
}
