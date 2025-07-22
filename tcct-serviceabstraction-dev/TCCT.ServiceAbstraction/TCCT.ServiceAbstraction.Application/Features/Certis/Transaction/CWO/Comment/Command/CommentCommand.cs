using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Comment.Command;
public class CommentCommand : ICommand<CommentResult>
{
	public int CwoId { get; set; }
	public int CommentTypeId { get; set; }
	public string Comment { get; set; } = null!;
	public DateTime CommentedOn { get; set; }
	public Guid CommentedBy { get; set; }

	public CommentCommand(CommentRequest request)
	{
		CwoId = request.CwoId;
		CommentTypeId = request.CommentTypeId;
		Comment = request.Comment;
		CommentedOn = request.CommentedOn;
		CommentedBy = request.CommentedBy;
	}
}
