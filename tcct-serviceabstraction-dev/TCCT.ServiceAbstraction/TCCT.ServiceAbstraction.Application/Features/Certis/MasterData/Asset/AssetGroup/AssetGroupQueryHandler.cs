using MediatR;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.Asset.AssetGroup;
public class AssetGroupQueryHandler : IQueryHandler<AssetGroupQuery, List<AssetGroupResult>>
{
	private readonly ICertisService _certisservice;
	public AssetGroupQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	async Task<List<AssetGroupResult>> IRequestHandler<AssetGroupQuery, List<AssetGroupResult>>.Handle(AssetGroupQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.MasterData.Asset.GetAssetGroups();
		return res;
	}
}
