namespace TCCTOBK.OperationBackend.Application;

public class PauseCWORequest
{
  public int cwoId { get; set; }
  public string pausedBy { get; set; }
  public string reason { get; set; }
}
