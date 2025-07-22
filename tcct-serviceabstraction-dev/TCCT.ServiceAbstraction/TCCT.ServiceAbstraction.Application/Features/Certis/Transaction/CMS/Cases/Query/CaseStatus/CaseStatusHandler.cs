using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.CaseStatus;
public class CaseStatusHandler : IQueryHandler<CaseStatusQuery, List<CaseStatusResult>>
{
	private readonly ICertisService _certisservice;
	public CaseStatusHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public Task<List<CaseStatusResult>> Handle(CaseStatusQuery request, CancellationToken cancellationToken)
	{
		return _certisservice.Transaction.CMSService.GetCaseStatus();
	}
}
