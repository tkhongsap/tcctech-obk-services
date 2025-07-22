using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.DMS.Query.DmsByObjectTypeHidden;
public class DmsByObjectTypeHiddenQueryHandler : IQueryHandler<DmsByObjectTypeHiddenQuery, List<DmsByObjectTypeHiddenResult>>
{
	private readonly ICertisService _certisservice;
	public DmsByObjectTypeHiddenQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<DmsByObjectTypeHiddenResult>> Handle(DmsByObjectTypeHiddenQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.DMSService.DmsByObjectTypeHidden(request.ObjectType);
		return res;
	}
}
