using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.PPM.DefaultConfig;
public class PPMDefaultConfigQueryHandler : IQueryHandler<PPMDefaultConfigQuery, PPMDefaultConfigResult>
{
	private readonly ICertisService _certisservice;
	public PPMDefaultConfigQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<PPMDefaultConfigResult> Handle(PPMDefaultConfigQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.MasterData.PPM.GetPPMDefaultConfig();
		return res;
	}
}
