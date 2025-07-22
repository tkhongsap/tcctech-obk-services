using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CMS.TaskStatuses;
public class TaskStatusesQueryHandler : IQueryHandler<TaskStatusesQuery, List<TaskStatusesResult>>
{
	private readonly ICertisService _certisservice;
	public TaskStatusesQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}

	public async Task<List<TaskStatusesResult>> Handle(TaskStatusesQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CMSService.GetTaskStatuses();
		return res;
	}
}
