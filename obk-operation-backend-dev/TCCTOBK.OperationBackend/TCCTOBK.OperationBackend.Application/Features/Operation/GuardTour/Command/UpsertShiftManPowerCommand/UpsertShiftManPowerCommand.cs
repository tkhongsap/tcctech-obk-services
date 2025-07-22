using MediatR;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpsertShiftManPowerCommand;

public class UpsertShiftManPowerCommandCommand : AuditableModel, IRequest<UpsertShiftManPowerCommandResult>
{
	public int? Id { get; set; }
	public string? Shift { get; set; }
	public string? BaseLocation { get; set; }
	public string? Company { get; set; }
	public string? Role { get; set; }
	public int? Demand { get; set; }
	public System.DateTime? StartDateTime { get; set; }
	public System.DateTime? EndDateTime { get; set; }
}
