using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.Cases;
public class CaseHandler : IQueryHandler<CaseQuery, List<CaseResult>>
{
	private readonly ICertisService _certisservice;
	public CaseHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public Task<List<CaseResult>> Handle(CaseQuery request, CancellationToken cancellationToken)
	{
		return _certisservice.Transaction.CMSService.GetCases();
	}
}
