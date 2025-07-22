using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.GetCaseById;
public class GetCaseByIdQueryHandler : IQueryHandler<GetCaseByIdQuery, GetCaseByIdResult>
{
	private readonly ICertisService _certisservice;
	public GetCaseByIdQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<GetCaseByIdResult> Handle(GetCaseByIdQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CMSService.GetCaseById(request.Id);
		return res;
	}
}
