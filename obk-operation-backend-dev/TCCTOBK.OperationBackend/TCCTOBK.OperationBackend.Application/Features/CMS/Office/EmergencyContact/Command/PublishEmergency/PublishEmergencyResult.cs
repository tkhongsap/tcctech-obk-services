using System;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.Office.EmergencyContact.Command.PublishEmergency;

public class PublishEmergencyResult
{
  public bool IsSuccess { get; set; }
  public string Message { get; set; }
  public string Version { get; set; }
}
