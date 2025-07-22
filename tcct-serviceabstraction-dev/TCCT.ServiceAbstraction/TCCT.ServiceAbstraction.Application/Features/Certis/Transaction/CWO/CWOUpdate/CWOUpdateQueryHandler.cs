using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.CWOUpdate;
public class CWOUpdateQueryHandler : IQueryHandler<CWOUpdateQuery, List<CWOUpdateResult>>
{
	private readonly ICertisService _certisservice;
	public CWOUpdateQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<CWOUpdateResult>> Handle(CWOUpdateQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CWOService.CWOUpdate(request.from, request.to, request.count, request.skip);
		return res;
	}
}
