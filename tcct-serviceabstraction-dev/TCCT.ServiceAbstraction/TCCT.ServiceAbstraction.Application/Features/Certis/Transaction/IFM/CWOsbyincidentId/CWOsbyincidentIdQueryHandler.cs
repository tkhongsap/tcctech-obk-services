using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.IFM.CWOsbyincidentId;
public class CWOsbyincidentIdQueryHandler : IQueryHandler<CWOsbyincidentIdQuery, List<CWOsbyincidentIdResult>>
{
	private readonly ICertisService _certisservice;
	public CWOsbyincidentIdQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<CWOsbyincidentIdResult>> Handle(CWOsbyincidentIdQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.IFMService.CWOsbyincidentId(request.Id);
		return res;
	}
}
