namespace TCCTOBK.OperationBackend.Application;

public class AcknowledgeCWORequest
{
  public AcknowledgeCWORequest(int cwoId, Guid ackedBy, string ackVerifiedBy, string acknowledgementSignature, string supportiveTechnicianIds, bool isWorkingOffline, string workOfflineReason, int locationId, string description, int requesterId, int assetId)
  {
    CwoId = cwoId;
    AckedBy = ackedBy;
    AckVerifiedBy = ackVerifiedBy;
    AcknowledgementSignature = acknowledgementSignature;
    SupportiveTechnicianIds = supportiveTechnicianIds;
    IsWorkingOffline = isWorkingOffline;
    WorkOfflineReason = workOfflineReason;
    LocationId = locationId;
    Description = description;
    RequesterId = requesterId;
    AssetId = assetId;
  }

  public int CwoId { get; set; }
  public Guid AckedBy { get; set; }
  public string AckVerifiedBy { get; set; }
  public string AcknowledgementSignature { get; set; }
  public string SupportiveTechnicianIds { get; set; }
  public bool IsWorkingOffline { get; set; }
  public string WorkOfflineReason { get; set; }
  public int LocationId { get; set; }
  public string Description { get; set; }
  public int RequesterId { get; set; }
  public int AssetId { get; set; }
}