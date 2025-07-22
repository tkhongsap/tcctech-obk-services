namespace TCCTOBK.OperationBackend.Application;

public class CloseCWORequestModel
{
  public int cwoId { get; set; }
  public string closureComment { get; set; }
  public string completionVerifiedBy { get; set; }
  public string closureSignature { get; set; }
  public string closedBy { get; set; }
}
