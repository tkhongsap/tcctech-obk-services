namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Comment.Query;
public class CommentsResult
{
	public int Id { get; set; }
	public int CommentTypeId { get; set; }
	public int WOId { get; set; }
	public string Comment { get; set; }
	public DateTime CreatedOn { get; set; }
	public string CreatedBy { get; set; }
}
