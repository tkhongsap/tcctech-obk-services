namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.UpdateTask;
public class UpdateTaskResult
{
	public List<Result> Result { get; set; } = new List<Result>();
	public int Id { get; set; }
	public int Status { get; set; }
	public bool IsCanceled { get; set; }
	public bool IsCompleted { get; set; }
	public bool IsCompletedSuccessfully { get; set; }
	public int CreationOptions { get; set; }
	public bool IsFaulted { get; set; }
}
public class Result
{
	public int Id { get; set; }
	public int CwoId { get; set; }
	public int TaskId { get; set; }
	public string TaskStatus { get; set; } = null!;
	public string Remarks { get; set; } = null!;
	public string Reading { get; set; } = null!;
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