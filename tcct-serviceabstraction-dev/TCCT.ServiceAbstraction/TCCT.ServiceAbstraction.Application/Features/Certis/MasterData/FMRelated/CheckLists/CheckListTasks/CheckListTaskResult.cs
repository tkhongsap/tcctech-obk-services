namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.FMRelated.CheckLists.CheckListTasks;
public class CheckListTaskResult
{
	public int Id { get; set; }
	public string? Status { get; set; }
	public int TaskId { get; set; }
	public string Description { get; set; } = string.Empty;
	public int ChecklistId { get; set; }
	public bool IsMandatory { get; set; }
	public bool IsAttachmentRequired { get; set; }
	public bool IsReadingRequired { get; set; }
	public int Duration { get; set; }
}
