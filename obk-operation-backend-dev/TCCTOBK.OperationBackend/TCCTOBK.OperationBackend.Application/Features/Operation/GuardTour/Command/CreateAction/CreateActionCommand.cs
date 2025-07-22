using MediatR;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateAction;

public class CreateActionCommand : AuditableModel, IRequest<CreateActionResult>
{
	public string Name { get; set; } = "";
	public string Description { get; set; } = "";
	public Guid ATID { get; set; }
	public GuardTourActionMetaDataResult? MetaData { get; set; }
}
