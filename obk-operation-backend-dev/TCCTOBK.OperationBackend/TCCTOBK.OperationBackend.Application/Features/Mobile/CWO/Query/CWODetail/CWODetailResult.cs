namespace TCCTOBK.OperationBackend.Application;

public class CWODetailResult
{

  public int CWOID { get; set; }
  public int Status { get; set; }
  public string? Statustext { get; set; }
  public string? CWORefNumber { get; set; }
  public string? CaseRefNumber { get; set; }
  public string? CreatedBy { get; set; }
  public string? Requester { get; set; }
  public int? Priority { get; set; }
  public string? PriorityText { get; set; }
  public string? CWOType { get; set; }
  public string? Tower { get; set; }
  public string? Location { get; set; }
  public string? ServiceCategory { get; set; }
  public string? Asset { get; set; }
  public string? Supervisor { get; set; }
  public string? SupervisorId { get; set; }
  public string? Technicain { get; set; }
  public string? TechnicainId { get; set; }
  public string? WorkDescription { get; set; }
  public string? Problemtype { get; set; }
  public int ProblemtypeId { get; set; }
  public int LocationId { get; set; }
  public int AssetId { get; set; }
  public int RequesterId { get; set; }
  public bool IsPause { get; set; }
  public string? SlaStart { get; set; }
  public string? SlaToResponse { get; set; }
  public string? SlaToResolve { get; set; }
  public string? EstimatedCompletion { get; set; }
  public string? ActualStart { get; set; }
  public string? ActualCompletion { get; set; }
  public List<DocumentWork> Documents { get; set; } = new();
  public List<DocumentWork> DocumentAll { get; set; } = new();
}
