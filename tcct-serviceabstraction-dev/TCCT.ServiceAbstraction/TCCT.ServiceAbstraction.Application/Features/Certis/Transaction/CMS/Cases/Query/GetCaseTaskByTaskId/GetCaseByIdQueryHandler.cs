using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Cases.Query.GetCaseTaskByTaskId;
public class GetCaseTaskByTaskIdQueryHandler : IQueryHandler<GetCaseTaskByTaskIdQuery, GetCaseTaskByTaskIdResult>
{
	private readonly ICertisService _certisservice;
	public GetCaseTaskByTaskIdQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<GetCaseTaskByTaskIdResult> Handle(GetCaseTaskByTaskIdQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CMSService.GetCaseTaskByTaskId(request.CaseId, request.TaskId);
		return res;
	}
}
