using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.API;

namespace TCCTOBK.OperationBackend.Application;

public class RejectTechnicianPPMHandler : IRequestHandler<RejectTechnicianPPMCommand, RejectTechnicianPPMResult>
{
  private readonly IAbstractionService _apiService;

  public RejectTechnicianPPMHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }

  public async Task<RejectTechnicianPPMResult> Handle(RejectTechnicianPPMCommand request, CancellationToken cancellationToken)
  {
    var data = new TechnicianRejectRequestPPMModel()
    {
      workOrderId = request.workOrderId,
      rejectedBy = request.rejectedBy,
      technicianId = request.technicianId,
    };
    var send = await _apiService.CertisTransaction.TechnicianRejectPPM(data);
    return new RejectTechnicianPPMResult();
  }
}
