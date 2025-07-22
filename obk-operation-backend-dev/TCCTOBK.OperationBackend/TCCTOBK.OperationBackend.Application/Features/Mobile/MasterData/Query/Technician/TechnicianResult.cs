namespace TCCTOBK.OperationBackend.Application;

public class TechnicianResult
{
  public int Total { get; set; }
  public int Available { get; set; }
  public List<TechniciansData> Data { get; set; } = new();
}


public class TechniciansData
{
  public string Id { get; set; }
  public string FullName { get; set; }
  public int UserType { get; set; }
  public bool IsAvailable { get; set; }
  public int? Service { get; set; }
}