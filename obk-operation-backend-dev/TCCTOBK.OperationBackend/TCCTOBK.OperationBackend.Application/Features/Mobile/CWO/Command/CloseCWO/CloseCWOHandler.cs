using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.API;

namespace TCCTOBK.OperationBackend.Application;

public class CloseCWOHandler : IRequestHandler<CloseCWOCommand, CloseCWOResult>
{
  private readonly IAbstractionService _apiService;

  public CloseCWOHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }

  public async Task<CloseCWOResult> Handle(CloseCWOCommand request, CancellationToken cancellationToken)
  {
    var data = new CloseCWORequestModel()
    {
      cwoId = request.cwoId,
      closureComment = request.closureComment,
      completionVerifiedBy = request.completionVerifiedBy,
      closureSignature = request.closureSignature,
      closedBy = request.closedBy,
    };
    var send = await _apiService.CertisTransaction.CloseCWO(data);
    return new CloseCWOResult();
  }
}
