using MediatR;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateAction;

public class UpdateActionCommand : AuditableModel, IRequest<UpdateActionResult>
{
	public string Name { get; set; } = "";
	public string Description { get; set; } = "";
	public Guid AID { get; set; }
	public GuardTourActionMetaDataResult MetaData { get; set; } = new GuardTourActionMetaDataResult();
}
