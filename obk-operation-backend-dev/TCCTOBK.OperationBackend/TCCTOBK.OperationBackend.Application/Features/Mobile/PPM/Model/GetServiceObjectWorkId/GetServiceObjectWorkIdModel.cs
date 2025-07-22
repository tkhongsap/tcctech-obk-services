namespace TCCTOBK.OperationBackend.Application;

public class GetServiceObjectWorkIdModel
{
  public int id { get; set; }
  public int objectId { get; set; }
  public string objectType { get; set; }
  public int woId { get; set; }
  public int checklistId { get; set; }
  public bool isTaskCompletionConfirmed { get; set; }
}
