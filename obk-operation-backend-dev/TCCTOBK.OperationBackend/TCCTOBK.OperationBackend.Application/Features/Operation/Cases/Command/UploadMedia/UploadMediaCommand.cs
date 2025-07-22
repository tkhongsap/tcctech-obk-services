using System;
using MediatR;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Command.UploadMedia;

public class UploadMediaCommand : IRequest<UploadMediaResult>
{
  public int CaseId { get; set; }
  public List<string>? ImagesBase64 { get; set; }
}
