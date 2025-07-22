using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetAction;

public record GetActionResult
{
	public Guid Id { get; set; }
	public string? Name { get; set; }
	public string? Description { get; set; }
	public Guid ActionTypeId { get; set; }
	public GuardTourActionMetaDataResult? MetaData { get; set; }
	public mtActionType? ActionType { get; set; } = null;
}