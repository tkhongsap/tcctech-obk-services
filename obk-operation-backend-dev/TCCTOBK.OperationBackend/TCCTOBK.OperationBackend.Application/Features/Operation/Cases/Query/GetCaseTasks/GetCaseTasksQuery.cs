using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Query.GetCaseTasks;
public class GetCaseTasksQuery : TableState, IQuery<GetCaseTasksResult>
{
	public int CaseId { get; set; }
	public GetCaseTasksQuery(int cid)
	{
		CaseId = cid;
	}
}