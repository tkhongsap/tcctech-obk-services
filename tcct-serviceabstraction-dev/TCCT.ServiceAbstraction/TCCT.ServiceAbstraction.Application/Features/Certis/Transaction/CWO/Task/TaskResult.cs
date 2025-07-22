namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Task;
public class TaskResult
{
	public int Id { get; set; }
	public int CwoId { get; set; }
	public int TaskId { get; set; }
	public int TaskNo { get; set; }
	public string Description { get; set; } = null!;
	public int ChecklistId { get; set; }
	public bool IsMandatory { get; set; }
	public bool IsAttachmentRequired { get; set; }
	public bool IsReadingRequired { get; set; }
	public bool IsRatingRequired { get; set; }
	public string CreatedBy { get; set; } = null!;
	public DateTime CreatedOn { get; set; }
	public string ModifiedBy { get; set; } = null!;
	public DateTime ModifiedOn { get; set; }
}
