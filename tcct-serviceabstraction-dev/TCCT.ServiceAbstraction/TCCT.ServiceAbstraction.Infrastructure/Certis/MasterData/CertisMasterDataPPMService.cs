using TCCT.ServiceAbstraction.Application.Contracts.Certis;
using TCCT.ServiceAbstraction.Application.Contracts.Certis.MasterData;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.PPM.DefaultConfig;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.PPM.FrequencyTypes;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.PPM.StatusCodes;

namespace TCCT.ServiceAbstraction.Infrastructure.Certis.MasterData;
public partial class CertisMasterDataPPMService : ICertisMasterDataPPMService
{
	ICertisEndpointProvider _endpointprovider;
	ICertisMemoryCache _cache;

	public CertisMasterDataPPMService(ICertisMemoryCache cache, ICertisEndpointProvider endpointProvider)
	{
		_endpointprovider = endpointProvider;
		_cache = cache;
	}

	public async Task<List<FrequencyTypeResult>> GetFrequencyTypes()
	{
		return await _endpointprovider.GetFrequencyTypes();
	}

	public async Task<PPMDefaultConfigResult> GetPPMDefaultConfig()
	{
		return await _endpointprovider.GetDefaultConfig();
	}

	public async Task<List<StatusCodesResult>> GetStatusCodes()
	{
		return await _endpointprovider.GetStatusCodes();
	}
}
