using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.Complete;
public class CompleteCommand : ICommand<CompleteResult>
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

	public CompleteCommand(CompleteRequest request)
	{
		CwoId = request.CwoId;
		CompletionComment = request.CompletionComment;
		CompletionAckedBy = request.CompletionAckedBy;
		CompletionSignature = request.CompletionSignature;
		CompletedBy = request.CompletedBy;
		LocationId = request.LocationId;
		Description = request.Description;
		RequesterId = request.RequesterId;
		AssetId = request.AssetId;
	}
}
