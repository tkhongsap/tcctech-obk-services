using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.UpdateTask;
public class UpdateTaskCommand : ICommand<UpdateTaskResult>
{
	public int Id { get; set; }
	public string TaskStatus { get; set; } = null!;
	public string DocumentId { get; set; } = "0";
	public string Remarks { get; set; } = null!;
	public string Reading { get; set; } = null!;
	public Guid UpdatedBy { get; set; }
	public DateTime UpdatedOn { get; set; }

	public UpdateTaskCommand(UpdateTaskRequest request)
	{
		Id = request.Id;
		TaskStatus = request.TaskStatus;
		DocumentId = request.DocumentId;
		Remarks = request.Remarks;
		Reading = request.Reading;
		UpdatedBy = request.UpdatedBy;
		UpdatedOn = request.UpdatedOn;
	}
}
