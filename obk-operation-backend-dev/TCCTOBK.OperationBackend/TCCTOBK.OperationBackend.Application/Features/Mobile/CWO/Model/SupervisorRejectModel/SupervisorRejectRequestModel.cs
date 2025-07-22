namespace TCCTOBK.OperationBackend.Application;

public class SupervisorRejectRequestModel
{
  public int cwoId { get; set; }
  public string rejectedBy { get; set; }
  public int locationId { get; set; }
  public string description { get; set; }
  public int requesterId { get; set; }
  public int assetId { get; set; }
}
