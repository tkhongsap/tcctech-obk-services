namespace TCCTOBK.OperationBackend.Application;

public class RejectCWORequest
{
  public RejectCWORequest(int cwoId, Guid rejectedBy, Guid technicianId, string operatorNote, int locationId, string description, int requesterId, int assetId)
  {
    CwoId = cwoId;
    RejectedBy = rejectedBy;
    TechnicianId = technicianId;
    OperatorNote = operatorNote;
    LocationId = locationId;
    Description = description;
    RequesterId = requesterId;
    AssetId = assetId;
  }

  public int CwoId { get; set; }
  public Guid RejectedBy { get; set; }
  public Guid TechnicianId { get; set; }
  public string OperatorNote { get; set; }
  public int LocationId { get; set; }
  public string Description { get; set; }
  public int RequesterId { get; set; }
  public int AssetId { get; set; }
}
