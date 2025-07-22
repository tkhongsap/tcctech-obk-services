using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Comment.Command;
public class CommentCommand : ICommand<CommentResult>
{
	public int WorkOrderId { get; set; }
	public int CommentTypeId { get; set; }
	public string Comment { get; set; } = null!;
	public DateTime CommentedOn { get; set; }
	public Guid CommentedBy { get; set; }

	public CommentCommand(CommentRequest request)
	{
		WorkOrderId = request.WorkOrderId;
		CommentTypeId = request.CommentTypeId;
		Comment = request.Comment;
		CommentedOn = request.CommentedOn;
		CommentedBy = request.CommentedBy;
	}
}
