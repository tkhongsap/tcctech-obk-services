using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.CheckListMaps;
public class CheckListMapsQueryHandler : IQueryHandler<CheckListMapsQuery, List<CheckListMapsResult>>
{
	private readonly ICertisService _certisservice;
	public CheckListMapsQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<CheckListMapsResult>> Handle(CheckListMapsQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.PPMService.CheckListMap();
		return res;
	}
}
