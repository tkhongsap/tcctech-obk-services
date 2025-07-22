using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Certis;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Task;
public class TaskQueryHandler : IQueryHandler<TaskQuery, List<TaskResult>>
{
	private readonly ICertisService _certisservice;
	public TaskQueryHandler(ICertisService certisservice)
	{
		_certisservice = certisservice;
	}
	public async Task<List<TaskResult>> Handle(TaskQuery request, CancellationToken cancellationToken)
	{
		var res = await _certisservice.Transaction.CWOService.Task(request.CwoIdsCsv);
		return res;
	}
}
