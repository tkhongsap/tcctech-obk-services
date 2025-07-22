using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.CaseMedia;
public class CaseMediaQuery : IQuery<List<CaseMediaResult>>
{
	public int CaseId { get; set; }

	public CaseMediaQuery(int caseId)
	{
		CaseId = caseId;
	}
}
