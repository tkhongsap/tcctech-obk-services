using MediatR;
using TCCTOBK.OperationBackend.Application.Contracts.API;

namespace TCCTOBK.OperationBackend.Application;

public class AcknowledgeWorkSecurityHandler : IRequestHandler<AcknowledgeWorkSecurityCommand, AcknowledgeWorkSecurityResult>
{
  private readonly IAbstractionService _apiService;
  public AcknowledgeWorkSecurityHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }

  public async Task<AcknowledgeWorkSecurityResult> Handle(AcknowledgeWorkSecurityCommand request, CancellationToken cancellationToken)
  {
    if (request.WorkType.ToLower() == "ppm")
    {
      var req = new AcknowledgePPMRequest(request.WorkId, new Guid(request.TechniciansId), "");
      await _apiService.CertisTransaction.AcknowlegePPM(req);
    }
    else if (request.WorkType.ToLower() == "cwo")
    {
      var req = new AcknowledgeCWORequest(request.WorkId, new Guid(request.TechniciansId), request.TechniciansId, "", request.TechniciansId, false, "", request.LocationId, "", request.WorkId, request.assetId);
      await _apiService.CertisTransaction.AcknowlegeCWO(req);
    }
    return new AcknowledgeWorkSecurityResult() { WorkId = request.WorkId };
  }
}
