using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Location.Locations;
public class LocationsQueryHandler : IQueryHandler<LocationsQuery, List<LocationsResult>>
{
	private readonly ICertisService _certisservice;
	public LocationsQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<LocationsResult>> Handle(LocationsQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.MasterData.Location.GetLocations();
		return res;
	}
}
