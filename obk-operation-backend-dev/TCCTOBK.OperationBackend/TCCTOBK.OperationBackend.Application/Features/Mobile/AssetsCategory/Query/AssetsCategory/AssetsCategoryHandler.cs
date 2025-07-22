using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts.API;
using TCCTOBK.OperationBackend.Application.Features.Operation.MasterData.Location.Model;

namespace TCCTOBK.OperationBackend.Application;

public class AssetsCategoryHandler : IQueryHandler<AssetsCategoryQuery, AssetsCategoryResult>
{

  private readonly IAbstractionService _apiService;

  public AssetsCategoryHandler(IAbstractionService apiService)
  {
    _apiService = apiService;
  }
  public async Task<AssetsCategoryResult> Handle(AssetsCategoryQuery request, CancellationToken cancellationToken)
  {
    var res = new AssetsCategoryResult{};
		return res;

  }

}

