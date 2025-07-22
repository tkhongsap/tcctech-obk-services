namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Close;
public class CloseRequest
{
	public int WorkOrderId { get; set; }
	public string ClosureComment { get; set; } = null!;
	public string CompletionVerifiedBy { get; set; } = null!;
	public string ClosureSignature { get; set; } = null!;
	public Guid ClosedBy { get; set; }

	public CloseRequest()
	{

	}

	public CloseRequest(int workOrderId, string closureComment, string completionVerifiedBy, string closureSignature, Guid closedBy)
	{
		WorkOrderId = workOrderId;
		ClosureComment = closureComment;
		CompletionVerifiedBy = completionVerifiedBy;
		ClosureSignature = closureSignature;
		ClosedBy = closedBy;
	}
}
