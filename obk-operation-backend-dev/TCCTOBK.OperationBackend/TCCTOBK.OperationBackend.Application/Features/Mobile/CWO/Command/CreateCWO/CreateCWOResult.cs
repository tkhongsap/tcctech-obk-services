using System;
using Amazon.SimpleEmail.Model;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Command.CreateCWO;

public class CreateCWOResult
{
  public int CWOId { get; set; }
  public string? CWO { get; set; }
  public string? AssignTo { get; set; }
  public string Message { get; set; } = "Success";
}
