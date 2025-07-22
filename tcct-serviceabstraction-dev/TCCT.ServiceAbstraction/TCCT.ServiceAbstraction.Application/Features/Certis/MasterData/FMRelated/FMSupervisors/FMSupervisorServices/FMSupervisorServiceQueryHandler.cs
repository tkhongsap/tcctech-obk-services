using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.FMSupervisors.FMSupervisorServices;
public class FMSupervisorServiceQueryHandler : IQueryHandler<FMSupervisorServiceQuery, List<FMSupervisorServiceResult>>
{
	private readonly ICertisService _certisservice;
	public FMSupervisorServiceQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<FMSupervisorServiceResult>> Handle(FMSupervisorServiceQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.MasterData.FMRelated.GetFMSupervisorServices();
		return res;
	}
}
