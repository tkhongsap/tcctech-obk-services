using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Operation.MasterData.Location.Model;

namespace TCCTOBK.OperationBackend.Application;

public class AssetsGroupHandler : IQueryHandler<AssetsGroupQuery, AssetsGroupResult>
{

  private readonly IAbstractionService _apiService;

  public AssetsGroupHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }
  public async Task<AssetsGroupResult> Handle(AssetsGroupQuery request, CancellationToken cancellationToken)
  {
    var res = new AssetsGroupResult { };
		return res;

  }

}

