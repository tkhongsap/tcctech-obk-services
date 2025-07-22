using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;

namespace TCCTOBK.OperationBackend.Application;

public class CaseIncidentTasksHandler : IQueryHandler<CaseIncidentTasksQuery, List<CaseIncidentTaskItem>>
{
	private readonly IAbstractionService _apiService;

	public CaseIncidentTasksHandler(IAbstractionService apiService)
	{
		_apiService = apiService;
	}

	public async Task<List<CaseIncidentTaskItem>> Handle(CaseIncidentTasksQuery request, CancellationToken cancellationToken)
	{
		var result = await _apiService.CertisTransaction.GetCaseIndidentTasks(request.TaskId);
		return result;
	}
}
