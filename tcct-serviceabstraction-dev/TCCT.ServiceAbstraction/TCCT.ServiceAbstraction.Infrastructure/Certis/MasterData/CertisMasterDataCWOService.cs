using TCCT.ServiceAbstraction.Application.Contracts.Certis;
using TCCT.ServiceAbstraction.Application.Contracts.Certis.MasterData;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.CWO.CWODefaultConfig;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.CWO.CWOStatusCode;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.CWO.CWOType;

namespace TCCT.ServiceAbstraction.Infrastructure.Certis.MasterData;
public partial class CertisMasterDataCWOService : ICertisMasterDataCWOService
{
	ICertisEndpointProvider _endpointprovider;
	ICertisMemoryCache _cache;

	public CertisMasterDataCWOService(ICertisMemoryCache cache, ICertisEndpointProvider endpointProvider)
	{
		_endpointprovider = endpointProvider;
		_cache = cache;
	}

	public async Task<CWODefaultConfigResult> GetCwoDefaultConfig()
	{
		return await _endpointprovider.GetCwoDefaultConfig();
	}

	public async Task<List<CWOStatusCodeResult>> GetCwoStatusCodes()
	{
		return await _endpointprovider.GetCwoStatusCodes();
	}

	public async Task<List<CWOTypeResult>> GetCwoTypes()
	{
		return await _endpointprovider.GetCwoTypes();
	}
}
