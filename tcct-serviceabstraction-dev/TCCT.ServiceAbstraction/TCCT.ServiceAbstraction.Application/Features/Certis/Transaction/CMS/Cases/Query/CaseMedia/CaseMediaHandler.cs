using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.CaseMedia;
public class CaseMediaHandler : IQueryHandler<CaseMediaQuery, List<CaseMediaResult>>
{
	private readonly ICertisService _certisservice;
	public CaseMediaHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public Task<List<CaseMediaResult>> Handle(CaseMediaQuery request, CancellationToken cancellationToken)
	{
		return _certisservice.Transaction.CMSService.GetCaseMediaByCaseId(request.CaseId);
	}
}
