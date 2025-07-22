using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Query.GetCaseList;
public class GetCaseListQuery : TableState, IQuery<GetCaseListResult>
{
	public string? Filter { get; set; }
	public int? CaseId { get; set; } = null;
	public List<int> CaseIds { get; set; } = new();
	public int? StatusCode { get; set; }
	public int? AssignedStaffId { get; set; }
}