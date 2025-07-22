using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.ServiceProviders;
public class ServiceProviderQueryHandler : IQueryHandler<ServiceProviderQuery, List<ServiceProviderResult>>
{
	private readonly ICertisService _certisservice;
	public ServiceProviderQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<ServiceProviderResult>> Handle(ServiceProviderQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.MasterData.FMRelated.GetServiceProviders();
		return res;
	}
}
