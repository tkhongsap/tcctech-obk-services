using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.PPM.StatusCodes;
public class StatusCodesQueryHandler : IQueryHandler<StatusCodesQuery, List<StatusCodesResult>>
{
	private readonly ICertisService _certisservice;
	public StatusCodesQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<StatusCodesResult>> Handle(StatusCodesQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.MasterData.PPM.GetStatusCodes();
		return res;
	}
}
