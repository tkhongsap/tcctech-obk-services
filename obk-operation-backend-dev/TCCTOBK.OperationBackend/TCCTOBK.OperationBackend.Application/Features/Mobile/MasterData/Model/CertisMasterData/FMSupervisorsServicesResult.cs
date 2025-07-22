namespace TCCTOBK.OperationBackend.Application;

public class FMSupervisorsServicesResult
{
  public int Id { get; set; }
  public string SupervisorId { get; set; } = default!;
  public int LocationId { get; set; }
  public bool IsDefault { get; set; }
}
