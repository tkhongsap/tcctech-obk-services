using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsByObjectTypeAndKeyHidden;
public class DmsByObjectTypeAndKeyHiddenQueryHandler : IQueryHandler<DmsByObjectTypeAndKeyHiddenQuery, List<DmsByObjectTypeAndKeyHiddenResult>>
{
	private readonly ICertisService _certisservice;
	public DmsByObjectTypeAndKeyHiddenQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}

	public async Task<List<DmsByObjectTypeAndKeyHiddenResult>> Handle(DmsByObjectTypeAndKeyHiddenQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.DMSService.GetDMSHiddenById(request.ObjectType, request.ObjectKey);
		return res;
	}
}
