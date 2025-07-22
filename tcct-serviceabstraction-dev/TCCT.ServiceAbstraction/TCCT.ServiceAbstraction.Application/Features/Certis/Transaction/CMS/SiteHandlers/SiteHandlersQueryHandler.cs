using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.SiteHandlers;
public class SiteHandlersQueryHandler : IQueryHandler<SiteHandlersQuery, List<SiteHandlersResult>>
{
	private readonly ICertisService _certisservice;
	public SiteHandlersQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}

	public async Task<List<SiteHandlersResult>> Handle(SiteHandlersQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CMSService.GetSiteHandlers();
		return res;
	}
}
