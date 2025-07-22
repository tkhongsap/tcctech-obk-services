using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;

namespace TCCTOBK.OperationBackend.Application;

public class CaseincidentEventTypeHandler : IQueryHandler<CaseincidentEventTypeQuery, List<CaseincidentEventTypeResult>>
{
  private readonly IAbstractionService _apiService;
  private readonly IMasterDataService _masterDataService;

  public CaseincidentEventTypeHandler(IAbstractionService apiService, IMasterDataService masterDataSevice)
  {
    _apiService = apiService;
    _masterDataService = masterDataSevice;
  }
  public async Task<List<CaseincidentEventTypeResult>> Handle(CaseincidentEventTypeQuery request, CancellationToken cancellationToken)
  {
    var data = await _masterDataService.GetCaseEventType(_apiService.MasterData.GetCaseEventType);
    var res = data.Select(x => new CaseincidentEventTypeResult()
    {
      Id = x.id,
      Code = x.code,
      Description = x.description
    }).ToList();
    return res;
  }
}
