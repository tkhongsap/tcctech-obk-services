using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.AcknowledgeAssignment;
public class AcknowledgeAssignmentCommand : ICommand<AcknowledgeAssignmentResult>
{
	public int CwoId { get; set; }
	public Guid AckedBy { get; set; }
	public string AckVerifiedBy { get; set; }
	public string AcknowledgementSignature { get; set; } = null!;
	public string SupportiveTechnicianIds { get; set; }
	public bool IsWorkingOffline { get; set; }
	public string WorkOfflineReason { get; set; } = null!;
	public int LocationId { get; set; }
	public string Description { get; set; } = null!;
	public int RequesterId { get; set; }
	public int AssetId { get; set; }

	public AcknowledgeAssignmentCommand(AcknowledgeAssignmentRequest request)
	{
		CwoId = request.CwoId;
		AckedBy = request.AckedBy;
		AckVerifiedBy = request.AckVerifiedBy;
		AcknowledgementSignature = request.AcknowledgementSignature;
		SupportiveTechnicianIds = request.SupportiveTechnicianIds;
		IsWorkingOffline = request.IsWorkingOffline;
		LocationId = request.LocationId;
		Description = request.Description;
		RequesterId = request.RequesterId;
		AssetId = request.AssetId;
	}
}
