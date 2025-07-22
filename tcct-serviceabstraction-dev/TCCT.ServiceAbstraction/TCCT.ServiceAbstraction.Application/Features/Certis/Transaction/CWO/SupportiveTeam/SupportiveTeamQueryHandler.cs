using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.SupportiveTeam;
public class SupportiveTeamQueryHandler : IQueryHandler<SupportiveTeamQuery, List<SupportiveTeamResult>>
{
	private readonly ICertisService _certisservice;
	public SupportiveTeamQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<SupportiveTeamResult>> Handle(SupportiveTeamQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CWOService.SupportiveTeam(request.Id);
		return res;
	}
}
