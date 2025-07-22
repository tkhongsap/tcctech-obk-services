namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Close;
public class CloseRequest
{
	public int CwoId { get; set; }
	public string ClosureComment { get; set; } = null!;
	public string CompletionVerifiedBy { get; set; } = null!;
	public string ClosureSignature { get; set; } = null!;
	public Guid ClosedBy { get; set; }

	public CloseRequest()
	{

	}

	public CloseRequest(int cwoId, string closureComment, string completionVerifiedBy, string closureSignature, Guid closedBy)
	{
		CwoId = cwoId;
		ClosureComment = closureComment;
		CompletionVerifiedBy = completionVerifiedBy;
		ClosureSignature = closureSignature;
		ClosedBy = closedBy;
	}
}
