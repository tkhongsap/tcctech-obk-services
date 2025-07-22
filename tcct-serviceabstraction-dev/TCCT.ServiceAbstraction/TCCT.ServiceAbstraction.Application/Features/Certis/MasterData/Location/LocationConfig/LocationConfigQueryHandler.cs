using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Location.LocationConfig;
public class LocationConfigQueryHandler : IQueryHandler<LocationConfigQuery, LocationConfigResult>
{
	private readonly ICertisService _certisservice;
	public LocationConfigQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<LocationConfigResult> Handle(LocationConfigQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.MasterData.Location.GetLocationConfig();
		return res;
	}
}
