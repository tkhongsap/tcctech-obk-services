using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Task;
public class TaskQuery : IQuery<List<TaskResult>>
{
	public string CwoIdsCsv { get; set; } = null!;

	public TaskQuery()
	{

	}

	public TaskQuery(string cwoIdsCsv)
	{
		CwoIdsCsv = cwoIdsCsv;
	}
}
