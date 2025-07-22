using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.API;

namespace TCCTOBK.OperationBackend.Application;

public class RejectWorkSecurityHandler : IRequestHandler<RejectWorkSecurityCommand, RejectWorkSecurityResult>
{
  private readonly IAbstractionService _apiService;
  public RejectWorkSecurityHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }
  public async Task<RejectWorkSecurityResult> Handle(RejectWorkSecurityCommand request, CancellationToken cancellationToken)
  {
    if (request.WorkType.ToLower() == "ppm")
    {
      var req = new RejectPPMRequest(request.WorkId, new Guid(request.TechniciansId), new Guid(request.TechniciansId));
      await _apiService.CertisTransaction.RejectPPM(req);
    }
    else if (request.WorkType.ToLower() == "cwo")
    {
      var req = new RejectCWORequest(request.WorkId, new Guid(request.TechniciansId), new Guid(request.TechniciansId), request.RejectReason, request.Location, request.RejectReason, request.WorkId, request.Location);
      await _apiService.CertisTransaction.RejectCWO(req);
    }
    return new RejectWorkSecurityResult() { WorkId = request.WorkId };
  }
}
