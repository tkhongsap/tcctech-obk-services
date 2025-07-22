using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.ConfirmTaskCompletion;
public class ConfirmTaskCompletionCommand : ICommand<ConfirmTaskCompletionResult>
{
	public int ObjectId { get; set; }
	public Guid ConfirmedBy { get; set; }

	public ConfirmTaskCompletionCommand(ConfirmTaskCompletionRequest request)
	{
		ObjectId = request.ServicingObjectId;
		ConfirmedBy = request.ConfirmedBy;
	}
}
