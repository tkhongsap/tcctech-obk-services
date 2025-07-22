using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Complete;
public class CompleteCommand : ICommand<CompleteResult>
{
	public int WoId { get; set; }
	public string CompletionComment { get; set; } = null!;
	public string CompletionSignature { get; set; } = null!;
	public Guid CompletedBy { get; set; }

	public CompleteCommand(CompleteRequest request)
	{
		WoId = request.WorkOrderId;
		CompletionComment = request.CompletionComment;
		CompletionSignature = request.CompletionSignature;
		CompletedBy = request.CompletedBy;
	}
}
