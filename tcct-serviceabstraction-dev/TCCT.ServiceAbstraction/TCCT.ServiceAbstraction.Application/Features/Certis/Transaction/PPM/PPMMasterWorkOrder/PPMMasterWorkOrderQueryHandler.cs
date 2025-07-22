using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.PPMMasterWorkOrder;
public class PPMMasterWorkOrderQueryHandler : IQueryHandler<PPMMasterWorkOrderQuery, List<PPMMasterWorkOrderResult>>
{
	private readonly ICertisService _certisservice;
	public PPMMasterWorkOrderQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<PPMMasterWorkOrderResult>> Handle(PPMMasterWorkOrderQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.PPMService.MasterWorkOrder();
		return res;
	}
}
