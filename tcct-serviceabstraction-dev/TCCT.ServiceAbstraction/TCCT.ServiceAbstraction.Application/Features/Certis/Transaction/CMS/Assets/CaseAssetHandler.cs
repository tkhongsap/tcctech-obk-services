using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Assets;
public class CaseAssetHandler : IQueryHandler<CaseAssetQuery, List<CaseAssetResult>>
{
	private readonly ICertisService _certisservice;
	public CaseAssetHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<CaseAssetResult>> Handle(CaseAssetQuery request, CancellationToken cancellationToken)
	{
		return await _certisservice.Transaction.CMSService.GetCaseAssets();
	}
}
