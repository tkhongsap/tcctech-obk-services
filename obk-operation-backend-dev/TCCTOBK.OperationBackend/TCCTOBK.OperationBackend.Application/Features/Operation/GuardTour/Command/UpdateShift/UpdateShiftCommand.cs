using MediatR;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateShift;

public class UpdateShiftCommand : AuditableModel, IRequest<UpdateShiftResult>
{
	public int Id { get; set; }
	public required string Name { get; set; }
	public TimeSpan? StartTime { get; set; }
	public TimeSpan? EndTime { get; set; }
	public TimeSpan? AllowCheckInStart { get; set; }
	public TimeSpan? AllowCheckInEnd { get; set; }
	public TimeSpan? CheckoutTimeEnd { get; set; }
	public int? IsOverNight { get; set; }

}
