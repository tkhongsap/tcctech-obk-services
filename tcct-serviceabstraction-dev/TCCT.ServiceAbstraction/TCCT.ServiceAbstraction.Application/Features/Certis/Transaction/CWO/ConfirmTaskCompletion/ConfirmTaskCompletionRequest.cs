namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.ConfirmTaskCompletion;
public class ConfirmTaskCompletionRequest
{
	public int CwoId { get; set; }
	public string ConfirmedBy { get; set; }

	public ConfirmTaskCompletionRequest()
	{

	}

	public ConfirmTaskCompletionRequest(int cwoId, string confirmedBy)
	{
		CwoId = cwoId;
		ConfirmedBy = confirmedBy;
	}
}
