using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.CaseLocations;
public class CaseLocationsQueryHandler : IQueryHandler<CaseLocationsQuery, List<CaseLocationsResult>>
{
	private readonly ICertisService _certisservice;
	public CaseLocationsQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}

	public async Task<List<CaseLocationsResult>> Handle(CaseLocationsQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CMSService.GetCaseLocations();
		return res;
	}
}
