using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.ServicingObject;
public class ServicingObjectQueryHandler : IQueryHandler<ServicingObjectQuery, List<ServicingObjectResult>>
{
	private readonly ICertisService _certisservice;
	public ServicingObjectQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<ServicingObjectResult>> Handle(ServicingObjectQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.PPMService.GetServicingObject(request.WoIdsCsv);
		return res;
	}
}
