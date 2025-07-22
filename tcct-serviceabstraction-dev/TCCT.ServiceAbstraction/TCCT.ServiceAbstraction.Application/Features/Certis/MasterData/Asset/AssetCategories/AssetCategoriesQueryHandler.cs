using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Asset.AssetCategories;
public sealed class AssetCategoriesQueryHandler : IQueryHandler<AssetCategoriesQuery, List<AssetCategoriesResult>>
{
	private readonly ICertisService _certisservice;
	public AssetCategoriesQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<AssetCategoriesResult>> Handle(AssetCategoriesQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.MasterData.Asset.GetAssetCategories();
		return res;
	}
}
