using TCCT.ServiceAbstraction.Application.Contracts.Certis;
using TCCT.ServiceAbstraction.Application.Contracts.Certis.MasterData;

namespace TCCT.ServiceAbstraction.Infrastructure.Certis.MasterData;
public partial class CertisMasterDataService : ICertisMasterDataService
{
	ICertisEndpointProvider _endpointprovider;
	ICertisMemoryCache _cache;

	public CertisMasterDataService(ICertisMemoryCache cache, ICertisEndpointProvider endpointProvider)
	{
		_endpointprovider = endpointProvider;
		_cache = cache;
	}

	private ICertisMasterDataAssetService _asset = null!;
	public ICertisMasterDataAssetService Asset => _asset ??= new CertisMasterDataAssetService(_cache, _endpointprovider);

	private ICertisMasterDataLocationService _location = null!;
	public ICertisMasterDataLocationService Location => _location ??= new CertisMasterDataLocationService(_cache, _endpointprovider);

	private ICertisMasterDataCWOService _cwo = null!;
	public ICertisMasterDataCWOService CWO => _cwo ??= new CertisMasterDataCWOService(_cache, _endpointprovider);

	private ICertisMasterDataFMRelatedService _fmrelated = null!;
	public ICertisMasterDataFMRelatedService FMRelated => _fmrelated ??= new CertisMasterDataFMRelatedService(_cache, _endpointprovider);

	private ICertisMasterDataPPMService _ppm = null!;
	public ICertisMasterDataPPMService PPM => _ppm ??= new CertisMasterDataPPMService(_cache, _endpointprovider);

	private ICertisMasterDataOtherService _other = null!;
	public ICertisMasterDataOtherService Other => _other ??= new CertisMasterDataOtherService(_cache, _endpointprovider);
}
