using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.CaseAssetCategories;
public class CaseAssetCategoriesQueryHandler : IQueryHandler<CaseAssetCategoriesQuery, List<CaseAssetCategoriesResult>>
{
	private readonly ICertisService _certisservice;
	public CaseAssetCategoriesQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}

	public async Task<List<CaseAssetCategoriesResult>> Handle(CaseAssetCategoriesQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CMSService.GetCaseAssetCategories();
		return res;
	}
}
