using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Task.CaseCreateTask;
public class CaseCreateTaskCommandHandler : ICommandHandler<CaseCreateTaskCommand, CaseCreateTaskResult>
{
	private readonly ICertisService _certisservice;
	public CaseCreateTaskCommandHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<CaseCreateTaskResult> Handle(CaseCreateTaskCommand request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CMSService.PostCaseCreateTasks(request.Name, request.CaseId, request.StatusCode, request.IsCritical, request.TaskCategoryId);
		return res;
	}
}
