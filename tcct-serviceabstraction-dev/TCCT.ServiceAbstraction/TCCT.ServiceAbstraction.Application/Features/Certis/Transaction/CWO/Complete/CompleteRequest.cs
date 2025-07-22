namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Complete;
public class CompleteRequest
{
	public int CwoId { get; set; }
	public string CompletionComment { get; set; } = null!;
	public string CompletionAckedBy { get; set; } = null!;
	public string CompletionSignature { get; set; } = null!;
	public Guid CompletedBy { get; set; }
	public int LocationId { get; set; }
	public string Description { get; set; } = null!;
	public int RequesterId { get; set; }
	public int? AssetId { get; set; }

	public CompleteRequest()
	{

	}

	public CompleteRequest(int cwoId, string completionComment, string completionAckedBy, string completionSignature, Guid completedBy, int locationId, string description, int requesterId, int? assetId)
	{
		CwoId = cwoId;
		CompletionComment = completionComment;
		CompletionAckedBy = completionAckedBy;
		CompletionSignature = completionSignature;
		CompletedBy = completedBy;
		LocationId = locationId;
		Description = description;
		RequesterId = requesterId;
		AssetId = assetId;
	}
}
