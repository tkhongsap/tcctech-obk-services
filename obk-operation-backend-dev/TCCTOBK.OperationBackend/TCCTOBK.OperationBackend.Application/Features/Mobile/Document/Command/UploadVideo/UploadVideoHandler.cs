using System;
using Refit;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Contracts.API;

namespace TCCTOBK.OperationBackend.Application.Features.Mobile.Document.Command.UploadVideo;

public class UploadVideoHandler : ICommandHandler<UploadVideoCommand, DocumentCertisResult>
{
  private readonly IAbstractionService _apiService;

  public UploadVideoHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }

  public async Task<DocumentCertisResult> Handle(UploadVideoCommand request, CancellationToken cancellationToken)
  {
    var file = await request.Video.GetBytesAsync();
    var contentType = request.Video.ContentType;
    contentType = contentType == "video/mp4" ? "video/mp4" : contentType;

    var result = await _apiService.CertisTransaction.UploadDocument(
      request.ObjectKey,
      request.ObjectType,
      request.Description,
      request.SearchTags,
      request.AttachmentType,
      request.IsDefault,
      request.IsHidden,
      new ByteArrayPart(file, Guid.NewGuid().ToString(), contentType)
    );

    return result;
  }
}
