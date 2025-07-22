namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Comment.Command;
public class CommentRequest
{
	public int WorkOrderId { get; set; }
	public int CommentTypeId { get; set; }
	public string Comment { get; set; } = null!;
	public DateTime CommentedOn { get; set; }
	public Guid CommentedBy { get; set; }

	public CommentRequest()
	{

	}

	public CommentRequest(int workOrderId, int commentTypeId, string comment, DateTime commentedOn, Guid commentedBy)
	{
		WorkOrderId = workOrderId;
		CommentTypeId = commentTypeId;
		Comment = comment;
		CommentedOn = commentedOn;
		CommentedBy = commentedBy;
	}
}
