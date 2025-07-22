using System;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Model.NotificationSendModel;

public class NotificationSendModel
{

  public Guid SendFrom { get; set; }
  public Guid SendTo { get; set; }
  public string AppLanguest { get; set; } = "EN";
}
