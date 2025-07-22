namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.UpdateTask;
public class UpdateTaskRequest
{
	public int Id { get; set; }
	public string TaskStatus { get; set; } = null!;
	public string Remarks { get; set; } = null!;
	public string Reading { get; set; } = null!;
	public Guid UpdatedBy { get; set; }
	public DateTime UpdatedOn { get; set; }

	public UpdateTaskRequest()
	{

	}

	public UpdateTaskRequest(int id, string taskStatus, string remarks, string reading, Guid updatedBy, DateTime updatedOn)
	{
		Id = id;
		TaskStatus = taskStatus;
		Remarks = remarks;
		Reading = reading;
		UpdatedBy = updatedBy;
		UpdatedOn = updatedOn;
	}
}
