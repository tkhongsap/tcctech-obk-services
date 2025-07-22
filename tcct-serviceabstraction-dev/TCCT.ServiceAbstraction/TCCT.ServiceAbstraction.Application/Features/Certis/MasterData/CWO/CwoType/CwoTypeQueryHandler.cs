using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;


namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.CWO.CWOType;
public class CWOTypeQueryHandler : IQueryHandler<CWOTypeQuery, List<CWOTypeResult>>
{
	private readonly ICertisService _certisservice;
	public CWOTypeQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<CWOTypeResult>> Handle(CWOTypeQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.MasterData.CWO.GetCwoTypes();
		return res;
	}
}
