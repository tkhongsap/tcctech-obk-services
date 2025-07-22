using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.API;

namespace TCCTOBK.OperationBackend.Application;

public class AcknowlegePPMHandler : IRequestHandler<AcknowlegePPMCommand, AcknowlegePPMResult>
{
  private readonly IAbstractionService _apiService;

  public AcknowlegePPMHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }

  public async Task<AcknowlegePPMResult> Handle(AcknowlegePPMCommand request, CancellationToken cancellationToken)
  {
    var data = new AcknowledgePPMRequest(
      request.WorkOrderId,
      request.AckedBy,
      request.AcknowledgementSignature
    );

    var send = await _apiService.CertisTransaction.AcknowlegePPM(data);
    return new AcknowlegePPMResult();
  }
}
