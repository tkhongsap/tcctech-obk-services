using TCCT.ServiceAbstraction.Application.Contracts.Certis;
using TCCT.ServiceAbstraction.Application.Contracts.Certis.MasterData;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Asset.AssetCategories;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Asset.AssetGroup;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Asset.Assets;

namespace TCCT.ServiceAbstraction.Infrastructure.Certis.MasterData;
public partial class CertisMasterDataAssetService : ICertisMasterDataAssetService
{
	ICertisEndpointProvider _endpointprovider;
	ICertisMemoryCache _cache;

	public CertisMasterDataAssetService(ICertisMemoryCache cache, ICertisEndpointProvider endpointProvider)
	{
		_endpointprovider = endpointProvider;
		_cache = cache;
	}

	public async Task<List<AssetCategoriesResult>> GetAssetCategories()
	{
		return await _endpointprovider.GetAssetCategories();
	}

	public async Task<List<AssetGroupResult>> GetAssetGroups()
	{
		return await _endpointprovider.GetAssetGroups();
	}

	public async Task<List<AssetResult>> GetAssets()
	{
		return await _endpointprovider.GetAssets();
	}

}
