using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Query.GetCaseTasksList;
public class GetCaseTasksListQuery : TableState, IQuery<GetCaseTasksListResult>
{
	public string? Filter { get; set; }
	public int? CaseTaskId { get; set; } = null;
	public List<int> CaseTaskIds { get; set; } = new();
	public int? StatusCode { get; set; }
	public int? AssignedStaffId { get; set; }
	public int? LocationId { get; set; }
	public int? PriorityLevelId { get; set; }
	public int? CaseStatusCode { get; set; }
}