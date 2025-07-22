using MediatR;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.ProcessSchedulePlan;

public class ProcessSchedulePlanCommand : AuditableModel, IRequest<ProcessSchedulePlanResult>
{
	public DateOnly StartDate { get; set; }
	public DateOnly EndDate { get; set; }

	public bool isCrons { get; set; } = false;
	public double TotalDays { get; set; }
	public required string Shift { get; set; }
}
