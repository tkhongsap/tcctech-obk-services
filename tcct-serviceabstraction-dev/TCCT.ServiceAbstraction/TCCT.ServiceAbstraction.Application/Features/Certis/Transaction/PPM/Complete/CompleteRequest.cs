namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.PPM.Complete;
public class CompleteRequest
{
	public int WorkOrderId { get; set; }
	public string CompletionComment { get; set; } = null!;
	public string CompletionSignature { get; set; } = null!;
	public Guid CompletedBy { get; set; }

	public CompleteRequest()
	{

	}

	public CompleteRequest(int workOrderId, string completionComment, string completionSignature, Guid completedBy)
	{
		WorkOrderId = workOrderId;
		CompletionComment = completionComment;
		CompletionSignature = completionSignature;
		CompletedBy = completedBy;
	}
}
