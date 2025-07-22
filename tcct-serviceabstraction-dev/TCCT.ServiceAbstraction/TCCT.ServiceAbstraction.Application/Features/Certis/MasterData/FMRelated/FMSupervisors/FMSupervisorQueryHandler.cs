using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.FMSupervisors;
public class FMSupervisorQueryHandler : IQueryHandler<FMSupervisorQuery, List<FMSupervisorResult>>
{
	private readonly ICertisService _certisservice;
	public FMSupervisorQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<FMSupervisorResult>> Handle(FMSupervisorQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.MasterData.FMRelated.GetFMSupervisors();
		return res;
	}
}
