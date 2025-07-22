using System;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Command.CreateCWO.AssignSupervisorModel;

public class AssignSupervisorResponse
{
  public int Id { get; set; }
  public int Status { get; set; }
  public bool IsCanceled { get; set; }
  public bool IsCompleted { get; set; }
  public bool IsCompletedSuccessfully { get; set; }
  public int CreationOptions { get; set; }
  public bool IsFaulted { get; set; }
}
