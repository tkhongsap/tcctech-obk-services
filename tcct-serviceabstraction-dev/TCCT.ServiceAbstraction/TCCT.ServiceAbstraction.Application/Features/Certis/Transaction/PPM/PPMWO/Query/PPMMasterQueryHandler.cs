using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.PPMWO.Query;
public class PPMMasterQueryHandler : IQueryHandler<PPMMasterQuery, List<PPMMasterResult>>
{
	private readonly ICertisService _certisservice;
	public PPMMasterQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<PPMMasterResult>> Handle(PPMMasterQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.PPMService.Master();
		return res;
	}
}
