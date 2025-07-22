namespace TCCTOBK.OperationBackend.Application;

public class ReworkCWORequestModel
{
  public int cwoId { get; set; }
  public string reasonToRework { get; set; }
  public string reworkRequestedBy { get; set; }
}
