using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Asset.Assets;
public class AssetQueryHandler : IQueryHandler<AssetQuery, List<AssetResult>>
{
	private readonly ICertisService _certisservice;
	public AssetQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<AssetResult>> Handle(AssetQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.MasterData.Asset.GetAssets();
		return res;
	}
}
