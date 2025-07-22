using MediatR;
using TCCTOBK.OperationBackend.Application.Features.Mobile.CWO.Model.NotificationSendModel;

namespace TCCTOBK.OperationBackend.Application;

public class ResumeWorkCWOCommand : NotificationSendModel, IRequest<ResumeWorkCWOResult>
{
  public int cwoId { get; set; }
  public string resumedBy { get; set; }
  public string? ImageBase64 { get; set; }
}
