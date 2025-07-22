using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetActivityProcedure;

public class GetActivityProcedureResult
{
	public Guid Id { get; set; }
	public required string Code { get; set; }
	public required string TaskName { get; set; }
	public required List<APSubtaskActionResult> SubtaskActions { get; set; }
	public string Location { get; set; }
	public Guid LocationId { get; set; }
}
