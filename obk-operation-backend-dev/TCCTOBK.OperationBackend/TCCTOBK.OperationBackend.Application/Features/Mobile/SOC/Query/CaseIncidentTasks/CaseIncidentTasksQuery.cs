using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application;

public class CaseIncidentTasksQuery : IQuery<List<CaseIncidentTaskItem>>
{
	public int TaskId { get; set; }
	public CaseIncidentTasksQuery(int taskId)
	{
		TaskId = taskId;
	}
}
