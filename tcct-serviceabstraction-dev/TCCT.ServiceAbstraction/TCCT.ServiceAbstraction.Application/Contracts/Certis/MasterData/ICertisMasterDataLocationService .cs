using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Location.LocationConfig;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Location.Locations;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Location.LocationTypes;

namespace TCCT.ServiceAbstraction.Application.Contracts.Certis.MasterData;
public interface ICertisMasterDataLocationService
{
	// Location management
	Task<List<LocationTypeResult>> GetLocationTypes();
	Task<List<LocationsResult>> GetLocations();
	Task<LocationConfigResult> GetLocationConfig();
}
