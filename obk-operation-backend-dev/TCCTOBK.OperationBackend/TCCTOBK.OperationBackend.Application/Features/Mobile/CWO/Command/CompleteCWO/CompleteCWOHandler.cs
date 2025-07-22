using MediatR;
using Refit;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.DataModel.TaskRepository;
using TCCTOBK.OperationBackend.Domain;

namespace TCCTOBK.OperationBackend.Application;

public class CompleteCWOHandler : IRequestHandler<CompleteCWOCommand, CompleteCWOResult>
{
  private readonly IAbstractionService _apiService;

  public CompleteCWOHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }

  public async Task<CompleteCWOResult> Handle(CompleteCWOCommand request, CancellationToken cancellationToken)
  {
    //step 1 complete task cwo 
    var taskofcwo = await _apiService.CertisTransaction.GetCWODetail(request.CwoId.ToString());
    try
    {
      foreach (var item in taskofcwo)
      {
        var updatetaskdata = new UpdateTaskCWORequestModel()
        {
          id = item.Id,
          taskStatus = "Completed",
          remarks = "done form opsapp",
          reading = "",
          updatedBy = request.CompletedBy,
          updatedOn = DateTime.Now
        };
        await _apiService.CertisTransaction.UpdateCWOTask(updatetaskdata);
      }
    }
    catch { }

    //step 2 confirm complete task
    try
    {
      var confirmcomplete = new ConfrimCompletionRequestModel()
      {
        cwoId = request.CwoId,
        confirmedBy = request.CompletedBy
      };
      var rescon = await _apiService.CertisTransaction.ConfirmCompleteCWO(confirmcomplete);
    }
    catch { }

    //step 3 complate cwo
    var complatedata = new CWOComplteTaskRequest(
        request.CwoId,
        request.CompletionComment,
        request.CompletionAckedBy,
        String.Empty,
        request.CompletedBy,
        request.LocationId,
        request.Description,
        request.RequesterId,
        request.AssetId
        );
    var data = await _apiService.CertisTransaction.CWOCompleteTask(complatedata);


    //step 4 upload image
    try
    {
      if (data.IsCompleted)
      {
        if (!string.IsNullOrEmpty(request.ImageBase64))
        {
          var imageBytes = Convert.FromBase64String(request.ImageBase64.Split(";base64,").Last());
          var contentType = request.ImageBase64.Split("data:").Last().Split(";base64,").First();
          var searchTags = OpAppConstant.CWO_COMPLETE_PREFIX;
          contentType = contentType == "image/jpg" ? "image/jpeg" : contentType;
          await _apiService.CertisTransaction.UploadDocument(request.CwoId, "CWO", "Complete", searchTags, "General", "0", "1", new ByteArrayPart(imageBytes, Guid.NewGuid().ToString(), contentType));
        }

        if (request.ImagesBase64 != null)
        {
          foreach (var image in request.ImagesBase64)
          {
            if (!string.IsNullOrEmpty(image))
            {
              var imageBytes = Convert.FromBase64String(image.Split(";base64,").Last());
              var contentType = image.Split("data:").Last().Split(";base64,").First();
              var searchTags = OpAppConstant.CWO_COMPLETE_PREFIX;
              contentType = contentType == "image/jpg" ? "image/jpeg" : contentType;
              await _apiService.CertisTransaction.UploadDocument(request.CwoId, "CWO", "Complete", searchTags, "General", "0", "1", new ByteArrayPart(imageBytes, Guid.NewGuid().ToString(), contentType));
            }
          }
        }
      }
    }
    catch { }
    return new CompleteCWOResult();
  }
}
