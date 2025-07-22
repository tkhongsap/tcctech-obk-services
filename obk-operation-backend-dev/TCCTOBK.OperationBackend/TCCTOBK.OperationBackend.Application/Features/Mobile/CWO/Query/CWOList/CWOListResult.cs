namespace TCCTOBK.OperationBackend.Application;

public class CWOListResult
{
  public int Items { get; set; }
  public int NEWItems { get; set; }
  public int ACKNOWLEDGEMENTItems { get; set; }
  public int INPROGRESSItems { get; set; }
  public int COMPLETEDItems { get; set; }
  public int CLOSEDItems { get; set; }
  public int CANCELLEDItems { get; set; }
  public int VERIFYItem { get; set; }
  public List<CWOData> Data { get; set; } = new();
}


public class CWOData
{
  public int CWOID { get; set; }
  public int ProblemType { get; set; } = default!;
  public string Title { get; set; } = default!;
  public string Description { get; set; } = default!;
  public string CreatedDate { get; set; } = default!;
  public int PriorityId { get; set; } = default!;
  public string Priority { get; set; } = default!;
  public int Status { get; set; }
  public string Location { get; set; } = default!;
  public bool IsPause { get; set; }
  public string ServiceCategory { get; set; }
}