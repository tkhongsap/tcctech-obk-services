using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.API;

namespace TCCTOBK.OperationBackend.Application;

public class AssignTechnicianPPMHandler : IRequestHandler<AssignTechnicianPPMCommand, AssignTechnicianPPMResult>
{
  private readonly IAbstractionService _apiService;

  public AssignTechnicianPPMHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }

  public async Task<AssignTechnicianPPMResult> Handle(AssignTechnicianPPMCommand request, CancellationToken cancellationToken)
  {
    var data = new PPMAssignTechnicianRequestModel()
    {
      workOrderId = request.workOrderId,
      technicianIds = request.technicianIds,
      assignedBy = request.assignedBy,
    };
    var send = await _apiService.CertisTransaction.AssignTechnicianPPM(data);
    return new AssignTechnicianPPMResult();
  }
}
