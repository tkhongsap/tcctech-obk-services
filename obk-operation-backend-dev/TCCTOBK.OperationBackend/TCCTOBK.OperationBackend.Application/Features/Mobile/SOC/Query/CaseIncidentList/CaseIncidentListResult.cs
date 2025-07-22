namespace TCCTOBK.OperationBackend.Application;

public class CaseIncidentListResult
{
  public int Total { get; set; }
  public int OpenCount { get; set; }
  public int CompleteCount { get; set; }
  public List<CaseIncidentItem> Data { get; set; } = new();
}
