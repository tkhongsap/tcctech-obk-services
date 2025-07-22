namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.ActivityProcedureRepository;
public class UpdateActivityProcedureModel
{
	public required Guid Id { get; set; }
	public required string Code { get; set; }
	public required string TaskName { get; set; }
	public required string SubtaskActions { get; set; }
	public Guid LocationId { get; set; }
}