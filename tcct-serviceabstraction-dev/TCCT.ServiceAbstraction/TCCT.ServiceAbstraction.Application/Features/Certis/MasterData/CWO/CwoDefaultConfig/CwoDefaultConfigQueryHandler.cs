using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;
using TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.CWO.CWODefaultConfig;


namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.CWO.CwoDefaultConfig;
public class CWODefaultConfigQueryHandler : IQueryHandler<CWODefaultConfigQuery, CWODefaultConfigResult>
{
	private readonly ICertisService _certisservice;
	public CWODefaultConfigQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<CWODefaultConfigResult> Handle(CWODefaultConfigQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.MasterData.CWO.GetCwoDefaultConfig();
		return res;
	}
}
