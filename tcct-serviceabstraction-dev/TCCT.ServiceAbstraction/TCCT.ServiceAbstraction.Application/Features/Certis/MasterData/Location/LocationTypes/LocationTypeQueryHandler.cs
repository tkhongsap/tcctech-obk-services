using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Location.LocationTypes;
public class LocationTypeQueryHandler : IQueryHandler<LocationTypeQuery, List<LocationTypeResult>>
{
	private readonly ICertisService _certisservice;
	public LocationTypeQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<LocationTypeResult>> Handle(LocationTypeQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.MasterData.Location.GetLocationTypes();
		return res;
	}
}
