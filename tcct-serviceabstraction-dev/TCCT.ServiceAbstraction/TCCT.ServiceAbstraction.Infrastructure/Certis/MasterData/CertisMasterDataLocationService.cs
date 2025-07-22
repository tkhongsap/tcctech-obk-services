using TCCT.ServiceAbstraction.Application.Contracts.Certis;
using TCCT.ServiceAbstraction.Application.Contracts.Certis.MasterData;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Location.LocationConfig;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Location.Locations;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Location.LocationTypes;

namespace TCCT.ServiceAbstraction.Infrastructure.Certis.MasterData;
public partial class CertisMasterDataLocationService : ICertisMasterDataLocationService
{
	ICertisEndpointProvider _endpointprovider;
	ICertisMemoryCache _cache;

	public CertisMasterDataLocationService(ICertisMemoryCache cache, ICertisEndpointProvider endpointProvider)
	{
		_endpointprovider = endpointProvider;
		_cache = cache;
	}

	public async Task<LocationConfigResult> GetLocationConfig()
	{
		return await _endpointprovider.GetLocationConfig();
	}

	public async Task<List<LocationsResult>> GetLocations()
	{
		return await _endpointprovider.GetLocations();
	}

	public async Task<List<LocationTypeResult>> GetLocationTypes()
	{
		return await _endpointprovider.GetLocationTypes();
	}

}
