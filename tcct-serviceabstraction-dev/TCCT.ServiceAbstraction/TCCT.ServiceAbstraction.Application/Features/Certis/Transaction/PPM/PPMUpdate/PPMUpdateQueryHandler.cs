using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.PPMUpdate;
public class PPMUpdateQueryHandler : IQueryHandler<PPMUpdateQuery, List<PPMUpdateResult>>
{
	private readonly ICertisService _certisservice;
	public PPMUpdateQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<PPMUpdateResult>> Handle(PPMUpdateQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.PPMService.PPMUpdate(request.from, request.to, request.count, request.skip);
		return res;
	}
}
