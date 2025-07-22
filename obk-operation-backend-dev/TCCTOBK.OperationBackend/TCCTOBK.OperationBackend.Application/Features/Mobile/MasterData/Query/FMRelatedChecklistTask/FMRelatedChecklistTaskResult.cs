namespace TCCTOBK.OperationBackend.Application.Features.Mobile.MasterData.Query.FMRelatedChecklistTask;
public class FMRelatedChecklistTaskResult
{
	public int TaskId { get; set; }
	public string Description { get; set; }

	public bool IsMandatory { get; set; }
	public bool IsAttachmentRequired { get; set; }
	public bool IsReadingRequired { get; set; }
	public int Duration { get; set; }
}
