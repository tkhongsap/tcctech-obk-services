using MediatR;
using Refit;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Model.CWOCommentModel;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application;

public class RejectTechnicianHandler : IRequestHandler<RejectTechnicianCommand, RejectTechnicianResult>
{
  private readonly IAbstractionService _apiService;

  public RejectTechnicianHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }

  public async Task<RejectTechnicianResult> Handle(RejectTechnicianCommand request, CancellationToken cancellationToken)
  {
    var data = new TechnicianRejectRequestModel()
    {
      cwoId = request.CWOId,
      rejectedBy = request.RejectedBy,
      locationId = request.LocationId,
      description = request.Description,
      requesterId = request.RequesterId,
      assetId = request.AssetId,
    };
    var send = await _apiService.CertisTransaction.TechnicianRejectCWO(data);

    var transactionId = send.result.cwoTransactions?.First().id;
    if (!string.IsNullOrEmpty(request.ImageBase64) && transactionId != null)
    {
      var imageBytes = Convert.FromBase64String(request.ImageBase64.Split(";base64,").Last());
      var contentType = request.ImageBase64.Split("data:").Last().Split(";base64,").First();
      var searchTags = OpAppConstant.CWO_REJECT_PREFIX + transactionId.ToString();
      contentType = contentType == "image/jpg" ? "image/jpeg" : contentType;
      await _apiService.CertisTransaction.UploadDocument(request.CWOId, "CWO", "Technicain Reject", searchTags, "General", "0", "1", new ByteArrayPart(imageBytes, Guid.NewGuid().ToString(), contentType));
    }
    // adhoc cwo reject cannot comment 
    try
    {
      var commentdata = new CWOCommentRequestModel()
      {
        CwoId = request.CWOId,
        CommentTypeId = 2,
        Comment = request.Comment,
        CommentedOn = DateTime.Now,
        CommentedBy = new Guid(request.RejectedBy),
      };
      await _apiService.CertisTransaction.CommentCWO(commentdata);
    }
    catch
    {
      return new RejectTechnicianResult();
    }

    return new RejectTechnicianResult();
  }
}


