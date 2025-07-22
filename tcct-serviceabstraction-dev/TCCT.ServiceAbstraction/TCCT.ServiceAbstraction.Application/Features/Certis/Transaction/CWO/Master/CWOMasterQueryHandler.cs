using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Master;
public class CWOMasterQueryHandler : IQueryHandler<CWOMasterQuery, List<CWOMasterResult>>
{
	private readonly ICertisService _certisservice;
	public CWOMasterQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<CWOMasterResult>> Handle(CWOMasterQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CWOService.Master();
		return res;
	}
}
