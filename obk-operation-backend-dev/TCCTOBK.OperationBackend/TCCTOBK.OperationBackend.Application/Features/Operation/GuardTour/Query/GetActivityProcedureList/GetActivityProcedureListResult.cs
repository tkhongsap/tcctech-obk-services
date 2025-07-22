using TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Model;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.GuardTour.Query.GetActivityProcedureList;
public class GetActivityProcedure
{
	public Guid Id { get; set; }
	public required string Code { get; set; }
	public required string TaskName { get; set; }
	public required List<APSubtaskActionResult> SubtaskActions { get; set; }
	public string Location { get; set; }
	public DateTime UpdatedDate { get; set; }
	public string UpdatedBy { get; set; }
}

public record GetActivityProcedureListResult(Paginate Paginate, List<GetActivityProcedure> Data);