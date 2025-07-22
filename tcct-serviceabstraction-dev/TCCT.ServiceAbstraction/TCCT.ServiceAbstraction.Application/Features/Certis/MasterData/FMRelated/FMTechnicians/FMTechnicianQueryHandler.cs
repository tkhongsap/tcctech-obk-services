using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.FMTechnicians;
public class FMTechnicianQueryHandler : IQueryHandler<FMTechnicianQuery, List<FMTechnicianResult>>
{
	private readonly ICertisService _certisservice;
	public FMTechnicianQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<FMTechnicianResult>> Handle(FMTechnicianQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.MasterData.FMRelated.GetFMTechnicians();
		return res;
	}
}
