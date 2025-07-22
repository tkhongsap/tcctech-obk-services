using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.API;

namespace TCCTOBK.OperationBackend.Application;

public class ReworkPPMHandler : IRequestHandler<ReworkPPMCommand, ReworkPPMResult>
{
  private readonly IAbstractionService _apiService;

  public ReworkPPMHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }

  public async Task<ReworkPPMResult> Handle(ReworkPPMCommand request, CancellationToken cancellationToken)
  {
    var data = new ReworkPPMRequestModel()
    {
      workOrderId = request.workOrderId,
      reasonToRework = request.reasonToRework,
      reworkRequestedBy = request.reworkRequestedBy,
    };
    var send = await _apiService.CertisTransaction.ReworkPPM(data);
    return new ReworkPPMResult();
  }
}
