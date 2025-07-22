namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Comment.Command;
public class CommentRequest
{
	public int CwoId { get; set; }
	public int CommentTypeId { get; set; }
	public string Comment { get; set; } = null!;
	public DateTime CommentedOn { get; set; }
	public Guid CommentedBy { get; set; }

	public CommentRequest()
	{

	}

	public CommentRequest(int cwoId, int commentTypeId, string comment, DateTime commentedOn, Guid commentedBy)
	{
		CwoId = cwoId;
		CommentTypeId = commentTypeId;
		Comment = comment;
		CommentedOn = commentedOn;
		CommentedBy = commentedBy;
	}
}
