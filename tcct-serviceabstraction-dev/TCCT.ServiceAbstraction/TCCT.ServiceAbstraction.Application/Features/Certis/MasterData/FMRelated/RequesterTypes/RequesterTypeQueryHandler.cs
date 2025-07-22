using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.RequesterTypes;
public class RequesterTypeQueryHandler : IQueryHandler<RequesterTypeQuery, List<RequesterTypeResult>>
{
	private readonly ICertisService _certisservice;
	public RequesterTypeQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<RequesterTypeResult>> Handle(RequesterTypeQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.MasterData.FMRelated.GetRequesterTypes();
		return res;
	}
}
