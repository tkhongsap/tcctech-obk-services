using MediatR;
using TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Model.NotificationSendModel;

namespace TCCTOBK.OperationBackend.Application;

public class CompleteCWOCommand : NotificationSendModel, IRequest<CompleteCWOResult>
{
  public int CwoId { get; set; }
  public string CompletionComment { get; set; }
  public string CompletionAckedBy { get; set; }
  public string CompletionSignature { get; set; }
  public string CompletedBy { get; set; }
  public int LocationId { get; set; }
  public string Description { get; set; }
  public int RequesterId { get; set; }
  public string? ImageBase64 { get; set; }
  public int AssetId { get; set; }
  public List<string>? ImagesBase64 { get; set; }
}
