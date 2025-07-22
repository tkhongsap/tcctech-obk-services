using MediatR;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateStatusSubtask;

public class UpdateStatusSubtaskCommand : AuditableModel, IRequest<UpdateStatusSubtaskResult>
{
	public int Status { get; set; } = default!;
	public Guid STID { get; set; }
	public string? Remarks { get; set; } = default!;
	public UpdateStatusSubtaskCommand(Guid stid, int status, string? remarks)
	{
		STID = stid;
		Status = status;
		Remarks = remarks;
	}
}
