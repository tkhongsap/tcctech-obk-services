using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.GetCaseTaskByTaskId;
public class GetCaseTaskByTaskIdQuery : IQuery<GetCaseTaskByTaskIdResult>
{
	public int CaseId { get; set; }
	public int TaskId { get; set; }

	public GetCaseTaskByTaskIdQuery(int caseid, int taskid)
	{
		CaseId = caseid;
		TaskId = taskid;
	}
}
