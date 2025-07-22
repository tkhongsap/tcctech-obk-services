using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.ServiceCategories;
public class ServiceCategoryQueryHandler : IQueryHandler<ServiceCategoryQuery, List<ServiceCategoryResult>>
{
	private readonly ICertisService _certisservice;
	public ServiceCategoryQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<ServiceCategoryResult>> Handle(ServiceCategoryQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.MasterData.FMRelated.GetServiceCategories();
		return res;
	}
}
