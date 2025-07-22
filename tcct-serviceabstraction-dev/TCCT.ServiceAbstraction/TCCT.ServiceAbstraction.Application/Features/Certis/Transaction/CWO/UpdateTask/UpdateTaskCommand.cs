using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.UpdateTask;
public class UpdateTaskCommand : ICommand<UpdateTaskResult>
{
	public int Id { get; set; }
	public string TaskStatus { get; set; } = null!;
	public string Remarks { get; set; } = null!;
	public string Reading { get; set; } = null!;
	public Guid UpdatedBy { get; set; }
	public DateTime UpdatedOn { get; set; }

	public UpdateTaskCommand(UpdateTaskRequest request)
	{
		Id = request.Id;
		TaskStatus = request.TaskStatus;
		Remarks = request.Remarks;
		Reading = request.Reading;
		UpdatedBy = request.UpdatedBy;
		UpdatedOn = request.UpdatedOn;
	}
}
