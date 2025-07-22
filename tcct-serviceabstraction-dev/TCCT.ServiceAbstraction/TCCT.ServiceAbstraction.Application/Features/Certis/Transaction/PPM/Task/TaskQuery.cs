using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Task;
public class TaskQuery : IQuery<List<TaskResult>>
{
	public string WorkOrderId { get; set; } = null!;

	public TaskQuery(string workOrderId)
	{
		WorkOrderId = workOrderId;
	}
}
