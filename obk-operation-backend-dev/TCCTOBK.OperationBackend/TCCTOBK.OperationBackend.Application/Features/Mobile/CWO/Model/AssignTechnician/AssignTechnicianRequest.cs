namespace TCCTOBK.OperationBackend.Application;

public class AssignTechnicianRequest
{
  public int cwoId { get; set; }
  public Guid assignedBy { get; set; }
  public Guid technicianId { get; set; }
  public string operatorNote { get; set; }
  public int locationId { get; set; }
  public string description { get; set; }
  public int requesterId { get; set; }
  public int assetId { get; set; }
}
