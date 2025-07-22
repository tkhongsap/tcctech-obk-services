using MediatR;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateTaskStatus;

public class UpdateTaskStatusCommand : AuditableModel, IRequest<UpdateTaskStatusResult>
{
	public Guid TID { get; set; }
	public int StatusId { get; set; }
	public DateTime? CompleteDate { get; set; }
	public string? CancelReason { get; set; }
}
