using MediatR;
using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Command.CreateLocation;

public class CreateLocationCommand : AuditableModel, IRequest<CreateLocationResult>
{
	public required string SiteName { get; set; }
	public string? ZoneName { get; set; }
	public string? BuildingName { get; set; }
	public string? BuildingZoneName { get; set; }
	public string? FloorName { get; set; }
	public required string Type { get; set; }
}
