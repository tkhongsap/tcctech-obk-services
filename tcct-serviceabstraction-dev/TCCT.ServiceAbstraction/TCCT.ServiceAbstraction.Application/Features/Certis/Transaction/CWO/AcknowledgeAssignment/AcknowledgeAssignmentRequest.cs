namespace TCCT.ServiceAbstraction.Application.Features.Certis.Transaction.CWO.AcknowledgeAssignment;
public class AcknowledgeAssignmentRequest
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

	public AcknowledgeAssignmentRequest()
	{
		CwoId = 0;
		AckedBy = new Guid();
		AckVerifiedBy = "";
		SupportiveTechnicianIds = "";
		AcknowledgementSignature = "";
		IsWorkingOffline = false;
		WorkOfflineReason = null!;
		LocationId = 0;
		Description = null!;
		RequesterId = 0;
		AssetId = 0;
	}

	public AcknowledgeAssignmentRequest(int cwoId, Guid ackedBy, string ackVerifyBy, string acknowledgementSignature, string supportiveTechnicianIds, bool isWorkingOffline, string workOfflineReason, int location, string description, int requesterId, int assetId)
	{
		CwoId = cwoId;
		AckedBy = ackedBy;
		AckVerifiedBy = ackVerifyBy;
		SupportiveTechnicianIds = supportiveTechnicianIds;
		AcknowledgementSignature = acknowledgementSignature;
		IsWorkingOffline = isWorkingOffline;
		WorkOfflineReason = workOfflineReason;
		LocationId = location;
		Description = description;
		RequesterId = requesterId;
		AssetId = assetId;
	}
}
