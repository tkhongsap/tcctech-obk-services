using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.CaseTypes;
public class CaseTypesQueryHandler : IQueryHandler<CaseTypesQuery, List<CaseTypesResult>>
{
	private readonly ICertisService _certisservice;
	public CaseTypesQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}

	public async Task<List<CaseTypesResult>> Handle(CaseTypesQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CMSService.GetCaseTypes();
		return res;
	}
}
