using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.ProblemTypes;
public class ProblemTypeQueryHandler : IQueryHandler<ProblemTypeQuery, List<ProblemTypeResult>>
{
	private readonly ICertisService _certisservice;
	public ProblemTypeQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<ProblemTypeResult>> Handle(ProblemTypeQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.MasterData.FMRelated.GetProblemTypes();
		return res;
	}
}
