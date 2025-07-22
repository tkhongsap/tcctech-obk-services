using MediatR;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateSchedulePlan;

public class CreateSchedulePlanCommand : AuditableModel, IRequest<CreateSchedulePlanResult>
{
	public required List<CreateSchedulePlanCommandData> CreateData { get; set; }
}

public class CreateSchedulePlanCommandData
{
	public required string Route { get; set; }
	public List<string> Frequency { get; set; } = new();
	public TimeSpan StartTime { get; set; }
	public TimeSpan EndTime { get; set; }
	public Guid MemberId { get; set; }
	public bool IsActive { get; set; } = true;
}	
