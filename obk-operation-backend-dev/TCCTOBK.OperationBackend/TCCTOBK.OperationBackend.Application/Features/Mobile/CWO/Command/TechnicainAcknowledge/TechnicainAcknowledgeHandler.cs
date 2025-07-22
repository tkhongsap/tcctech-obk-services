using MediatR;
using Refit;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application;

public class TechnicainAcknowledgeHandler : IRequestHandler<TechnicainAcknowledgeCommand, TechnicainAcknowledgeResult>
{
  private readonly IAbstractionService _apiService;

  public TechnicainAcknowledgeHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }

  public async Task<TechnicainAcknowledgeResult> Handle(TechnicainAcknowledgeCommand request, CancellationToken cancellationToken)
  {
    var cwoack = new AcknowledgeCWORequest(
        request.CwoId,
        request.AckedBy,
        request.AckVerifiedBy,
        request.AcknowledgementSignature,
        request.SupportiveTechnicianIds,
        false,
        "",
        request.LocationId,
        request.Description,
        request.RequesterId,
        request.AssetId
    );
    var data = await _apiService.CertisTransaction.AcknowlegeCWO(cwoack);
    var transactionId = data.result.cwoTransactions?.First().id;
    if (!string.IsNullOrEmpty(request.ImageBase64) && transactionId != null)
    {
      var imageBytes = Convert.FromBase64String(request.ImageBase64.Split(";base64,").Last());
      var contentType = request.ImageBase64.Split("data:").Last().Split(";base64,").First();
      var searchTags = OpAppConstant.CWO_ACKNOWLEDGE_PREFIX + transactionId.ToString();
      contentType = contentType == "image/jpg" ? "image/jpeg" : contentType;
      // await _apiService.CertisTransaction.UploadDocument(request.CwoId, "CWO", request.Description, searchTags, "General", "0", "1", new ByteArrayPart(imageBytes, Guid.NewGuid().ToString(), contentType));
      await _apiService.CertisTransaction.UploadDocument(request.CwoId, "CWO", "Acknowledge", searchTags, "General", "0", "1", new ByteArrayPart(imageBytes, Guid.NewGuid().ToString(), contentType));

    }
    return new TechnicainAcknowledgeResult();
  }
}
