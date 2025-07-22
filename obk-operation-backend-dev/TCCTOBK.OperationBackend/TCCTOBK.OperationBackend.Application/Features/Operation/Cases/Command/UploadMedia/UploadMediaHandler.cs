using System;
using MediatR;
using Refit;
using TCCTOBK.OperationBackend.Application.Contracts.API;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.Cases.Command.UploadMedia;

public class UploadMediaHandler : IRequestHandler<UploadMediaCommand, UploadMediaResult>
{
  private readonly IAbstractionService _apiService;

  public UploadMediaHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }

  public async Task<UploadMediaResult> Handle(UploadMediaCommand request, CancellationToken cancellationToken)
  {
    if (request.ImagesBase64 != null)
    {
      foreach (var image in request.ImagesBase64)
      {
        if (!string.IsNullOrEmpty(image))
        {
          {
            var imageBytes = Convert.FromBase64String(image.Split(";base64,").Last());
            var stream = new MemoryStream(imageBytes);
            var streamPart = new StreamPart(stream, "image.png", "image/png");
            await _apiService.CertisTransaction.CreateCaseMedia(request.CaseId, streamPart);
          }
        }
      }
    }
    return new UploadMediaResult();
  }

}

