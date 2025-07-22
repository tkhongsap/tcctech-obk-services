using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.ServiceCategories.ServingLocations;
public class ServingLocationQueryHandler : IQueryHandler<ServingLocationQuery, List<ServingLocationResult>>
{
	private readonly ICertisService _certisservice;
	public ServingLocationQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<ServingLocationResult>> Handle(ServingLocationQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.MasterData.FMRelated.GetServingLocations();
		return res;
	}
}
