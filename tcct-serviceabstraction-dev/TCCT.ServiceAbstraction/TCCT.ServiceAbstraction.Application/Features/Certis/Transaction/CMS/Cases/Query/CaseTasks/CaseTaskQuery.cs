using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.CaseTasks;
public class CaseTaskQuery : IQuery<List<CaseTaskResult>>
{
	public int CaseId { get; set; }
	public CaseTaskQuery(int caseId)
	{
		CaseId = caseId;
	}
	public CaseTaskQuery()
	{
	}
}
