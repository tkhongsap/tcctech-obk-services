using System;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.Document.Model;

public class UploadMediaResult
{
  public int caseId { get; set; }
  public string mediaName { get; set; } = default!;
  public bool isSuccess { get; set; }
}
