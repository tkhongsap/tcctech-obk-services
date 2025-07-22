using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Operation.MasterData.Location.Model;

namespace TCCTOBK.OperationBackend.Application;

public class AssetsHandler : IQueryHandler<AssetsQuery, AssetsResult>
{

  private readonly IAbstractionService _apiService;

  public AssetsHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }
  public async Task<AssetsResult> Handle(AssetsQuery request, CancellationToken cancellationToken)
  {
    var res = new AssetsResult{};
		return res;

  }

}

