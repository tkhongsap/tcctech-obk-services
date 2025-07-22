using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.CaseTasks;
public class CaseTaskHandler : IQueryHandler<CaseTaskQuery, List<CaseTaskResult>>
{
	private readonly ICertisService _certisservice;
	public CaseTaskHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public Task<List<CaseTaskResult>> Handle(CaseTaskQuery request, CancellationToken cancellationToken)
	{
		return _certisservice.Transaction.CMSService.GetCaseTaskByCaseId(request.CaseId);
	}
}
