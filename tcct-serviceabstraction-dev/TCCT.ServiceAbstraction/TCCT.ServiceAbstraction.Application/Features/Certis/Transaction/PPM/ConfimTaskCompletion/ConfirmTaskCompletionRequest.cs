namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.ConfirmTaskCompletion;
public class ConfirmTaskCompletionRequest
{
	public int ServicingObjectId { get; set; }
	public Guid ConfirmedBy { get; set; }

	public ConfirmTaskCompletionRequest()
	{

	}

	public ConfirmTaskCompletionRequest(int servicingObjectId, Guid confirmedBy)
	{
		ServicingObjectId = servicingObjectId;
		ConfirmedBy = confirmedBy;
	}
}
