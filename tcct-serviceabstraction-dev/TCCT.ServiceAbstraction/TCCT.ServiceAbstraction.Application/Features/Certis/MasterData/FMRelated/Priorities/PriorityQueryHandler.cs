using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.Priorities;
public class PriorityQueryHandler : IQueryHandler<PriorityQuery, List<PriorityResult>>
{
	private readonly ICertisService _certisservice;
	public PriorityQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<PriorityResult>> Handle(PriorityQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.MasterData.FMRelated.GetPriorities();
		return res;
	}
}
