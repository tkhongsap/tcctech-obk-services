using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.API;

namespace TCCTOBK.OperationBackend.Application;

public class RejectSupervisorPPMHandler : IRequestHandler<RejectSupervisorPPMCommand, RejectSupervisorPPMResult>
{
  private readonly IAbstractionService _apiService;

  public RejectSupervisorPPMHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }

  public async Task<RejectSupervisorPPMResult> Handle(RejectSupervisorPPMCommand request, CancellationToken cancellationToken)
  {
    var data = new SupervisorRejectRequestPPMModel()
    {
      workOrderId = request.workOrderId,
      rejectedBy = request.rejectedBy
    };
    var send = await _apiService.CertisTransaction.SupervisorRejectPPM(data);
    return new RejectSupervisorPPMResult();
  }
}
