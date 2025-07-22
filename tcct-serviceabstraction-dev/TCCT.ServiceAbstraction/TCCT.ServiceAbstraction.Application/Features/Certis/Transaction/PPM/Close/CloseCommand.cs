using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Close;
public class CloseCommand : ICommand<CloseResult>
{
	public int WoId { get; set; }
	public string ClosureComment { get; set; } = null!;
	public string CompletionVerifiedBy { get; set; } = null!;
	public string ClosureSignature { get; set; } = null!;
	public Guid ClosedBy { get; set; }

	public CloseCommand(CloseRequest request)
	{
		WoId = request.WorkOrderId;
		ClosureComment = request.ClosureComment;
		CompletionVerifiedBy = request.CompletionVerifiedBy;
		ClosureSignature = request.ClosureSignature;
		ClosedBy = request.ClosedBy;
	}
}
