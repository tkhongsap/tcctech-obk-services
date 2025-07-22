using MediatR;
using Refit;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Model.CWOCommentModel;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application;

public class RejectSupervisorHandler : IRequestHandler<RejectSupervisorCommand, RejectSupervisorResult>
{
  private readonly IAbstractionService _apiService;

  public RejectSupervisorHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }

  public async Task<RejectSupervisorResult> Handle(RejectSupervisorCommand request, CancellationToken cancellationToken)
  {
    var data = new SupervisorRejectRequestModel()
    {
      cwoId = request.cwoId,
      rejectedBy = request.rejectedBy,
      locationId = request.locationId,
      description = request.description,
      requesterId = request.requesterId,
      assetId = request.assetId,
    };
    var send = await _apiService.CertisTransaction.SupervisorRejectCWO(data);
    var transactionId = send.result.cwoTransactions?.First().id;
    if (!string.IsNullOrEmpty(request.ImageBase64) && transactionId != null)
    {
      var imageBytes = Convert.FromBase64String(request.ImageBase64.Split(";base64,").Last());
      var contentType = request.ImageBase64.Split("data:").Last().Split(";base64,").First();
      var searchTags = OpAppConstant.CWO_REJECT_PREFIX + transactionId.ToString();
      contentType = contentType == "image/jpg" ? "image/jpeg" : contentType;
      await _apiService.CertisTransaction.UploadDocument(request.cwoId, "CWO", "Superviser Reject", searchTags, "General", "0", "1", new ByteArrayPart(imageBytes, Guid.NewGuid().ToString(), contentType));
    }

    var commentdata = new CWOCommentRequestModel()
    {
      CwoId = request.cwoId,
      CommentTypeId = 2,
      Comment = request.Comment,
      CommentedOn = DateTime.Now,
      CommentedBy = new Guid(request.rejectedBy),
    };
    await _apiService.CertisTransaction.CommentCWO(commentdata);

    return new RejectSupervisorResult();
  }
}
