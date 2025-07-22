using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.Task.CaseCreateTask;
public class CaseUpdateTaskHandler : ICommandHandler<CaseUpdateTaskCommand, CaseUpdateTaskResult>
{
	private readonly ICertisService _certisservice;
	public CaseUpdateTaskHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public Task<CaseUpdateTaskResult> Handle(CaseUpdateTaskCommand request, CancellationToken cancellationToken)
	{
		return _certisservice.Transaction.CMSService.UpdateTaskById(request.Id, request.Name, request.CaseId, request.StatusCode, request.TaskCategoryId, request.IsCritical, request.AssignedStaffId, request.AssignedStaffDisplayName, request.CreatedBy, request.CreatedOn, request.Sequence);
	}

}