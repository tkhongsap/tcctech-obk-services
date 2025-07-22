using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetTaskActivityProcedureList;
public class GetTaskActivityProcedure
{
	public Guid Id { get; set; }
	public required string Code { get; set; }
	public required string TaskName { get; set; }
	public Guid LocationId { get; set; }
	public required List<APSubtaskActionResult> SubtaskActions { get; set; }
	public string Location { get; set; }
	public DateTime UpdatedDate { get; set; }
	public string UpdatedBy { get; set; }
}

public record GetTaskActivityProcedureListResult(Paginate Paginate, List<GetTaskActivityProcedure> Data);