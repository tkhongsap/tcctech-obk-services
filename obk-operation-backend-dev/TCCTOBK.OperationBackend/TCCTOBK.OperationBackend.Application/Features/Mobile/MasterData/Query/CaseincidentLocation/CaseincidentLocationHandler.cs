using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;

namespace TCCTOBK.OperationBackend.Application;

public class CaseincidentLocationHandler : IQueryHandler<CaseincidentLocationQuery, List<CaseincidentLocationResult>>
{
  private readonly IAbstractionService _apiService;
  private readonly IMasterDataService _masterDataService;

  public CaseincidentLocationHandler(IAbstractionService apiService, IMasterDataService masterDataSevice)
  {
    _apiService = apiService;
    _masterDataService = masterDataSevice;
  }

  public async Task<List<CaseincidentLocationResult>> Handle(CaseincidentLocationQuery request, CancellationToken cancellationToken)
  {
    var data = await _masterDataService.GetCaseLocation(_apiService.MasterData.GetCaseLocation);
    var res = data.Select(x => new CaseincidentLocationResult()
    {
      LocationTypeId = x.locationTypeId,
      Id = x.id,
      Name = x.name,
      FullName = x.fullName
    }).ToList();
    return res;
  }
}
