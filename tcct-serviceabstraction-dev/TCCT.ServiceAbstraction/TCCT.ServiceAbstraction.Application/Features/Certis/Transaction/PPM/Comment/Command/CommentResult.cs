namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Comment.Command;
public class CommentResult
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
	public int CommentTypeId { get; set; }
	public int WOId { get; set; }
	public string Comment { get; set; } = null!;
	public DateTime CreatedOn { get; set; }
	public string CreatedBy { get; set; } = null!;
}
