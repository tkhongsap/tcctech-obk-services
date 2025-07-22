using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;

namespace TCCTOBK.OperationBackend.Application;

public class CaseIncidentDetailHandler : IQueryHandler<CaseIncidentDetailQuery, CaseIncidentDetailResult>
{
  private readonly IAbstractionService _apiService;

  public CaseIncidentDetailHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }

  public async Task<CaseIncidentDetailResult> Handle(CaseIncidentDetailQuery request, CancellationToken cancellationToken)
  {
    var result = await _apiService.CertisTransaction.GetCaseIndidentDetail(request.Id);
    return result;
  }
}
