using System;
using Microsoft.AspNetCore.Http;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.Document.Command.UploadVideo;

public class UploadVideoCommand : ICommand<DocumentCertisResult>
{
  public int ObjectKey { get; set; }
  public string ObjectType { get; set; } = default!;
  public string Description { get; set; } = default!;
  public string SearchTags { get; set; } = default!;
  public string AttachmentType { get; set; } = default!;
  public string IsDefault { get; set; } = default!;
  public string IsHidden { get; set; } = default!;
  public IFormFile Video { get; set; } = default!;
}
