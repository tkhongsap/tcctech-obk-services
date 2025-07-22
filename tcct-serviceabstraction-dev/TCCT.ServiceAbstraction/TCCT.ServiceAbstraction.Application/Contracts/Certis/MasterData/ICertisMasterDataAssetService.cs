using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Asset.AssetCategories;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Asset.AssetGroup;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Asset.Assets;

namespace TCCT.ServiceAbstraction.Application.Contracts.Certis.MasterData;
public interface ICertisMasterDataAssetService
{
	// Assets Module
	Task<List<AssetCategoriesResult>> GetAssetCategories();
	Task<List<AssetGroupResult>> GetAssetGroups();
	Task<List<AssetResult>> GetAssets();
}
