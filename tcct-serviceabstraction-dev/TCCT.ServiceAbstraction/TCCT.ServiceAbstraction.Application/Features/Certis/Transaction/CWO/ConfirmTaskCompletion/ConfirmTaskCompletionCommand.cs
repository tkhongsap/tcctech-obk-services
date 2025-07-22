using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.ConfirmTaskCompletion;
public class ConfirmTaskCompletionCommand : ICommand<ConfirmTaskCompletionResult>
{
	public int CwoId { get; set; }
	public string ConfirmedBy { get; set; }

	public ConfirmTaskCompletionCommand(ConfirmTaskCompletionRequest request)
	{
		CwoId = request.CwoId;
		ConfirmedBy = request.ConfirmedBy;
	}
}
