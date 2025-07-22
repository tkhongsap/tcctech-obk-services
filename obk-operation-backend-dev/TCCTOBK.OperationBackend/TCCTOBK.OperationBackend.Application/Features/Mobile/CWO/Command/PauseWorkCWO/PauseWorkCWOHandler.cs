using MediatR;
using Refit;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application;

public class PauseWorkCWOHandler : IRequestHandler<PauseWorkCWOCommand, PauseWorkCWOResult>
{
  private readonly IAbstractionService _apiService;

  public PauseWorkCWOHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }

  public async Task<PauseWorkCWOResult> Handle(PauseWorkCWOCommand request, CancellationToken cancellationToken)
  {
    var data = new PauseCWORequest()
    {
      cwoId = request.cwoId,
      pausedBy = request.pausedBy,
      reason = request.reason,
    };
    var send = await _apiService.CertisTransaction.PauseCWO(data);
    var transactionId = send.result.cwoTransactions?.First().id;
    if (!string.IsNullOrEmpty(request.ImageBase64) && transactionId != null)
    {
      var imageBytes = Convert.FromBase64String(request.ImageBase64.Split(";base64,").Last());
      var contentType = request.ImageBase64.Split("data:").Last().Split(";base64,").First();
      var searchTags = OpAppConstant.CWO_PAUSE_PREFIX + transactionId.ToString();
      contentType = contentType == "image/jpg" ? "image/jpeg" : contentType;
      await _apiService.CertisTransaction.UploadDocument(request.cwoId, "CWO", "Pause", searchTags, "General", "0", "1", new ByteArrayPart(imageBytes, Guid.NewGuid().ToString(), contentType));
    }
    return new PauseWorkCWOResult();
  }
}
