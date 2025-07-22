using MediatR;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateSchedulePlan;

public class UpdateSchedulePlanCommand : AuditableModel, IRequest<UpdateSchedulePlanResult>
{
	public Guid SDPID { get; set; }
	public required string Route { get; set; }
	public List<string>? Frequency { get; set; } = new();
	public TimeSpan? StartTime { get; set; }
	public TimeSpan? EndTime { get; set; }
	public Guid MemberId { get; set; }
	public bool IsActive { get; set; } = true;
}
