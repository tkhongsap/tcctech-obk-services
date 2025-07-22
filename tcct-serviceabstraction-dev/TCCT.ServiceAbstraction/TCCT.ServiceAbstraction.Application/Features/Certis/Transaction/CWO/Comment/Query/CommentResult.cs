namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Comment.Query;
public class CommentResult
{
	public int Id { get; set; }
	public int CommentTypeId { get; set; }
	public int CwoId { get; set; }
	public string Comment { get; set; } = null!;
	public bool IsSynced { get; set; }
	public string CreatedBy { get; set; } = null!;
	public DateTime CreatedOn { get; set; }
}
