namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.CommentById;
public class CommentByIdResult
{
	public int Id { get; set; }
	public int CommentTypeId { get; set; }
	public int CwoId { get; set; }
	public string Comment { get; set; }
	public bool IsSynced { get; set; }
	public Guid CreatedBy { get; set; }
	public DateTime CreatedOn { get; set; }

}
