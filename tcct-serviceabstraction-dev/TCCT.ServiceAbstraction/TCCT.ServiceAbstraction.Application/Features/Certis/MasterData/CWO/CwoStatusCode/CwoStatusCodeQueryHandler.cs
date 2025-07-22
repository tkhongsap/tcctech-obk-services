using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;


namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.CWO.CWOStatusCode;
public class CwoStatusCodeQueryHandler : IQueryHandler<CWOStatusCodeQuery, List<CWOStatusCodeResult>>
{
	private readonly ICertisService _certisservice;
	public CwoStatusCodeQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<CWOStatusCodeResult>> Handle(CWOStatusCodeQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.MasterData.CWO.GetCwoStatusCodes();
		return res;
	}
}
