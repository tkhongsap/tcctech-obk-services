namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.UpdateTask;
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
	public int WOId { get; set; }
	public int ServicingObjectId { get; set; }
	public int TaskId { get; set; }
	public string TaskStatus { get; set; } = null!;
	public string Reading { get; set; } = null!;
	public string Remarks { get; set; } = null!;
	public int TaskNo { get; set; }
	public string Description { get; set; } = null!;
	public bool IsMandatory { get; set; }
	public bool IsAttachmentRequired { get; set; }
	public bool IsReadingRequired { get; set; }
	public bool IsRatingRequired { get; set; }
	public DateTime ModifiedOn { get; set; }
	public string ModifiedBy { get; set; } = null!;
}
