namespace TCCTOBK.OperationBackend.Application;

public class PPMAssignTechnicianResponseModel
{
  public int id { get; set; }
  public int status { get; set; }
  public bool isCanceled { get; set; }
  public bool isCompleted { get; set; }
  public bool isCompletedSuccessfully { get; set; }
  public int creationOptions { get; set; }
  public bool isFaulted { get; set; }
}
