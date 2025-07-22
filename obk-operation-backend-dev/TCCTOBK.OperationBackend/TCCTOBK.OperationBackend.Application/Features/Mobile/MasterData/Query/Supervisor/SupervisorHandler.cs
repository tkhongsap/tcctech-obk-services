using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Contracts.API.Abstraction;

namespace TCCTOBK.OperationBackend.Application;

public class SupervisorHandler : IQueryHandler<SupervisorQuery, List<SupervisorResult>>
{
  private readonly IAbstractionService _apiService;
  private readonly IMasterDataService _masterDataService;

  public SupervisorHandler(IAbstractionService apiService, IMasterDataService masterDataSevice)
  {
    _apiService = apiService;
    _masterDataService = masterDataSevice;
  }

  public async Task<List<SupervisorResult>> Handle(SupervisorQuery request, CancellationToken cancellationToken)
  {
    var supervisor = await _masterDataService.FMsupervisors(_apiService.MasterData.FMsupervisors);
    var res = supervisor.Select(x => new SupervisorResult()
    {
      Id = x.id,
      FullName = x.fullName
    }).OrderByDescending(x => x.FullName).ToList();
    return res;
  }
}
