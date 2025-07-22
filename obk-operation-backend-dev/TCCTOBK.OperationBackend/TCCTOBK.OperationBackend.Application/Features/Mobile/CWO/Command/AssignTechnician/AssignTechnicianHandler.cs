using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Helper.FCMNotification.Service;

namespace TCCTOBK.OperationBackend.Application;

public class AssignTechnicianHandler : IRequestHandler<AssignTechnicianCommand, AssignTechnicianResult>
{
  private readonly IAbstractionService _apiService;
  private readonly IFCMNotificationService _fcmnoti;

  public AssignTechnicianHandler(IAbstractionService apiService, IFCMNotificationService fcmnoti)
  {
    _apiService = apiService;
    _fcmnoti = fcmnoti;
  }
  public async Task<AssignTechnicianResult> Handle(AssignTechnicianCommand request, CancellationToken cancellationToken)
  {
    var assigndata = new AssignTechnicianRequest()
    {
      cwoId = request.CWOId,
      assignedBy = new Guid(request.AssignedBy),
      technicianId = new Guid(request.TechnicianId),
      operatorNote = request.OperatorNote,
      locationId = request.LocationId,
      description = request.Description,
      requesterId = request.RequesterId,
      assetId = request.AssetId
    };
    var data = await _apiService.CertisTransaction.AssignTechnician(assigndata);
    return new AssignTechnicianResult();
  }
}
