using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.CaseLocationTypes;
public class CaseLocationTypeHandler : IQueryHandler<CaseLocationTypeQuery, List<CaseLocationTypeResult>>
{
	private readonly ICertisService _certisservice;
	public CaseLocationTypeHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<CaseLocationTypeResult>> Handle(CaseLocationTypeQuery request, CancellationToken cancellationToken)
	{
		return await _certisservice.Transaction.CMSService.GetCaseLocationTypes();
	}
}
