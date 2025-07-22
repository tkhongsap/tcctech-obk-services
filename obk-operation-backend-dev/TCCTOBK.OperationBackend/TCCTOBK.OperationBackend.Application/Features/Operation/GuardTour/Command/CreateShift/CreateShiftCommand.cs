using MediatR;
using Org.BouncyCastle.Asn1.Cms;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateShift;

public class CreateShiftCommand : AuditableModel, IRequest<CreateShiftResult>
{
	public required string Name { get; set; }
	public TimeSpan? StartTime { get; set; }
	public TimeSpan? EndTime { get; set; }
	public TimeSpan? AllowCheckInStart { get; set; }
	public TimeSpan? AllowCheckInEnd { get; set; }
	public TimeSpan? CheckoutTimeEnd { get; set; }
	public int? IsOverNight { get; set; }
}
