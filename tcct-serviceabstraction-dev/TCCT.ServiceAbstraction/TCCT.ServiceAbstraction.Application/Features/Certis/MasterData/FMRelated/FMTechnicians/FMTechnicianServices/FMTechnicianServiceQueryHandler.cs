using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.FMTechnicians.FMTechnicianServices;
public class FMTechnicianServiceQueryHandler : IQueryHandler<FMTechnicianServiceQuery, List<FMTechnicianServiceResult>>
{
	private readonly ICertisService _certisservice;
	public FMTechnicianServiceQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<FMTechnicianServiceResult>> Handle(FMTechnicianServiceQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.MasterData.FMRelated.GetFMTechnicianServices();
		return res;
	}
}
