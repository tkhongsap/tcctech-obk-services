using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetActionType;

public record GetActionTypeResult
{
	public Guid Id { get; set; }
	public string? Action { get; set; }
}