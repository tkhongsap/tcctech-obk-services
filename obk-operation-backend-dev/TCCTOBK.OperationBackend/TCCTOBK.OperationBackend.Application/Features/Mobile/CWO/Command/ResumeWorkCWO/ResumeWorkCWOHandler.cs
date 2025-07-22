using MediatR;
using Refit;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application;

public class ResumeWorkCWOHandler : IRequestHandler<ResumeWorkCWOCommand, ResumeWorkCWOResult>
{
  private readonly IAbstractionService _apiService;

  public ResumeWorkCWOHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }

  public async Task<ResumeWorkCWOResult> Handle(ResumeWorkCWOCommand request, CancellationToken cancellationToken)
  {
    var data = new ResumeCWORequest()
    {
      cwoId = request.cwoId,
      resumedBy = request.resumedBy,
    };
    var send = await _apiService.CertisTransaction.ResumeCWO(data);
    var transactionId = send.result.cwoTransactions?.First().id;
    if (!string.IsNullOrEmpty(request.ImageBase64) && transactionId != null)
    {
      var imageBytes = Convert.FromBase64String(request.ImageBase64.Split(";base64,").Last());
      var contentType = request.ImageBase64.Split("data:").Last().Split(";base64,").First();
      var searchTags = OpAppConstant.CWO_RESUME_PREFIX + transactionId.ToString();
      contentType = contentType == "image/jpg" ? "image/jpeg" : contentType;
      await _apiService.CertisTransaction.UploadDocument(request.cwoId, "CWO", "", searchTags, "General", "0", "1", new ByteArrayPart(imageBytes, Guid.NewGuid().ToString(), contentType));
    }
    return new ResumeWorkCWOResult();
  }
}
