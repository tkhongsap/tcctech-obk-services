using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.API;

namespace TCCTOBK.OperationBackend.Application;

public class ClosePPMHandler : IRequestHandler<ClosePPMCommand, ClosePPMResult>
{
  private readonly IAbstractionService _apiService;

  public ClosePPMHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }

  public async Task<ClosePPMResult> Handle(ClosePPMCommand request, CancellationToken cancellationToken)
  {
    var data = new ClosePPMRequestModel()
    {
      workOrderId = request.workOrderId,
      closureComment = request.closureComment,
      completionVerifiedBy = request.completionVerifiedBy,
      closureSignature = request.closureSignature,
      closedBy = request.closedBy,
    };
    var send = await _apiService.CertisTransaction.ClosePPM(data);
    return new ClosePPMResult();
  }
}
