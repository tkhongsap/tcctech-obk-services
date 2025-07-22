using MediatR;
using Refit;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application;

public class ReworkCWOHandler : IRequestHandler<ReworkCWOCommand, ReworkCWOResult>
{
  private readonly IAbstractionService _apiService;

  public ReworkCWOHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }

  public async Task<ReworkCWOResult> Handle(ReworkCWOCommand request, CancellationToken cancellationToken)
  {
    var data = new ReworkCWORequestModel()
    {
      cwoId = request.cwoId,
      reasonToRework = request.reasonToRework,
      reworkRequestedBy = request.reworkRequestedBy,
    };
    var send = await _apiService.CertisTransaction.ReworkCWO(data);
    var transactionId = send.result.cwoTransactions?.First().id;
    if (!string.IsNullOrEmpty(request.ImageBase64) && transactionId != null)
    {
      var imageBytes = Convert.FromBase64String(request.ImageBase64.Split(";base64,").Last());
      var contentType = request.ImageBase64.Split("data:").Last().Split(";base64,").First();
      var searchTags = OpAppConstant.CWO_REWORK_PREFIX + transactionId.ToString();
      contentType = contentType == "image/jpg" ? "image/jpeg" : contentType;
      await _apiService.CertisTransaction.UploadDocument(request.cwoId, "CWO", "Rework", searchTags, "General", "0", "1", new ByteArrayPart(imageBytes, Guid.NewGuid().ToString(), contentType));
    }
    return new ReworkCWOResult();
  }
}
