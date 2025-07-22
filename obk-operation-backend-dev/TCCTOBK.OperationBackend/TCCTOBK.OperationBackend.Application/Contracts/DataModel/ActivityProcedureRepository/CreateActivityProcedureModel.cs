namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.ActivityProcedureRepository;
public class CreateActivityProcedureModel
{
	public string Code { get; set; }
	public string TaskName { get; set; }
	public string SubtaskActions { get; set; }
	public Guid LocationId { get; set; }

	public CreateActivityProcedureModel(string code, string taskName, string subtaskActions, Guid locationId)
	{
		Code = code;
		TaskName = taskName;
		SubtaskActions = subtaskActions;
		LocationId = locationId;
	}
}
