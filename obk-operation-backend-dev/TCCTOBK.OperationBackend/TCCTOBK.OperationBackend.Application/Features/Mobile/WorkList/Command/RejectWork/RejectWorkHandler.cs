using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.API;

namespace TCCTOBK.OperationBackend.Application;

public class RejectWorkHandler : IRequestHandler<RejectWorkCommand, RejectWorkResult>
{
  private readonly IAbstractionService _apiService;
  public RejectWorkHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }
  public async Task<RejectWorkResult> Handle(RejectWorkCommand request, CancellationToken cancellationToken)
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
    return new RejectWorkResult() { WorkId = request.WorkId };
  }
}
