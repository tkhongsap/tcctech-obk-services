using MediatR;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateStatusAction;

public class UpdateStatusActionCommand : AuditableModel, IRequest<UpdateStatusActionResult>
{
	public int Status { get; set; } = default!;
	public Guid AID { get; set; }
	public Guid STID { get; set; }
	public string? QrId { get; set; }
	public string? Remarks { get; set; }
	public string? Reading { get; set; }
	public GuardTourSubtaskActionMetaDataResult? MetaData { get; set; }
}
