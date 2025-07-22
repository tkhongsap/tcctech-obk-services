using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.CasesUpdates;
public class CasesUpdatesHandler : IQueryHandler<CasesUpdatesQuery, List<CasesUpdatesResult>>
{
	private readonly ICertisService _certisservice;
	public CasesUpdatesHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public Task<List<CasesUpdatesResult>> Handle(CasesUpdatesQuery request, CancellationToken cancellationToken)
	{
		return _certisservice.Transaction.CMSService.GetCasesUpdates(request.from, request.to, request.count, request.skip);
	}
}
