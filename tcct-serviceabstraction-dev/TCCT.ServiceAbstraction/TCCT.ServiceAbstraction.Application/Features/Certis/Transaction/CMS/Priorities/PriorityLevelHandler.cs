using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Priorities;
public class PriorityLevelHandler : IQueryHandler<PriorityLevelQuery, List<PriorityLevelResult>>
{
	private readonly ICertisService _certisservice;
	public PriorityLevelHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public Task<List<PriorityLevelResult>> Handle(PriorityLevelQuery request, CancellationToken cancellationToken)
	{
		return _certisservice.Transaction.CMSService.GetPriorityLevel();
	}
}