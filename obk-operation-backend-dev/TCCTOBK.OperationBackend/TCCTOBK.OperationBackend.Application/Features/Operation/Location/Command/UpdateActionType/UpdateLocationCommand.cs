using MediatR;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.UpdateLocation;

public class UpdateLocationCommand : AuditableModel, IRequest<UpdateLocationResult>
{
	public Guid LID { get; set; }
	public string? SiteName { get; set; }
	public string? ZoneName { get; set; }
	public string? BuildingName { get; set; }
	public string? BuildingZoneName { get; set; }
	public string? FloorName { get; set; }
	public string? Type { get; set; }
}
