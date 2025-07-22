using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.SlaConfigs;
public class SlaConfigsQueryHandler : IQueryHandler<SlaConfigsQuery, List<SlaConfigsResult>>
{
	private readonly ICertisService _certisservice;
	public SlaConfigsQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}

	public async Task<List<SlaConfigsResult>> Handle(SlaConfigsQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CMSService.GetSlaConfigs();
		return res;
	}
}
