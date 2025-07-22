using TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Model;

namespace TCCTOBK.OperationBackend.Application;

public class TechnicianRejectResponseModel
{
  public int id { get; set; }
  public int status { get; set; }
  public bool isCanceled { get; set; }
  public bool isCompleted { get; set; }
  public bool isCompletedSuccessfully { get; set; }
  public int creationOptions { get; set; }
  public bool isFaulted { get; set; }
  public List<CWOTransection> cwoTransactions { get; set; } = new();
  public List<CWOComment> cwoComments { get; set; } = new();
}

