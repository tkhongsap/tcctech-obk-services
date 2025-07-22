using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.Requesters;
public class RequesterQueryHandler : IQueryHandler<RequesterQuery, List<RequesterResult>>
{
	private readonly ICertisService _certisservice;
	public RequesterQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<RequesterResult>> Handle(RequesterQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.MasterData.FMRelated.GetRequesters();
		return res;
	}
}
