using TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Model;

namespace TCCTOBK.OperationBackend.Application;

public class ResumeCWOResponse
{
  public int id { get; set; }
  public int status { get; set; }
  public bool isCanceled { get; set; }
  public bool isCompleted { get; set; }
  public bool isCompletedSuccessfully { get; set; }
  public int creationOptions { get; set; }
  public bool isFaulted { get; set; }
  public CWOResultModel result { get; set; } = new();
}
